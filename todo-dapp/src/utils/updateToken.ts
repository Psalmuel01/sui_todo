import { bcs } from '@mysten/bcs';
import init, { deserialize, version, update_constants, update_identifiers, get_constants } from '@mysten/move-bytecode-template';
import url from '@mysten/move-bytecode-template/move_bytecode_template_bg.wasm?url';
import bytecodeUrl from '/regulated_coin.mv?url';
import { Buffer } from 'buffer';

const fetchBytecode = async (): Promise<Uint8Array> => {
  try {
    const res = await fetch(bytecodeUrl);
    if (!res.ok) throw new Error(`Failed to fetch bytecode: ${res.statusText}`);
    return new Uint8Array(await res.arrayBuffer());
  } catch (err) {
    console.error('Error fetching bytecode:', err);
    throw err;
  }
};

const encodeText = (text: string): Uint8Array =>
  new TextEncoder().encode(text);

interface UpdateTokenResult {
  constants: any;
  initialBytes: Uint8Array;
  updatedBytes: Uint8Array;
}

export const useUpdateToken = async (
  name: string,
  symbol: string,
  description: string,
  decimal: number
): Promise<UpdateTokenResult> => {
  try {
    const initialBytes = await fetchBytecode();
    console.log('Initial Bytes:', initialBytes);

    // to get hex for nextjs app as it cant read mv file
    // const bytes = Buffer.from(initialBytes);
    // const hex = bytes.toString('hex');
    // console.log(hex);

    await init(url);
    deserialize(initialBytes);
    version(); // Optional: version check

    let updatedBytes = update_identifiers(initialBytes, {
      TEMPLATE: "MY_COIN",
      template: "my_coin",
    });

    updatedBytes = update_constants(
      updatedBytes,
      bcs.u8().serialize(decimal).toBytes(),
      bcs.u8().serialize(5).toBytes(),
      'U8',
    );

    updatedBytes = update_constants(
      updatedBytes,
      bcs.vector(bcs.u8()).serialize(encodeText(symbol)).toBytes(),
      bcs.vector(bcs.u8()).serialize(encodeText('RGCN')).toBytes(),
      'Vector(U8)',
    );

    updatedBytes = update_constants(
      updatedBytes,
      bcs.vector(bcs.u8()).serialize(encodeText(name)).toBytes(),
      bcs.vector(bcs.u8()).serialize(encodeText('Regulated Coin')).toBytes(),
      'Vector(U8)',
    );

    updatedBytes = update_constants(
      updatedBytes,
      bcs.vector(bcs.u8()).serialize(encodeText(description)).toBytes(),
      bcs.vector(bcs.u8()).serialize(encodeText('Example Regulated Coin')).toBytes(),
      'Vector(U8)',
    );

    const constants = get_constants(initialBytes);
    console.log('Constants:', constants);
    console.assert(updatedBytes !== initialBytes, 'Bytecode was not updated!');

    return { constants, initialBytes, updatedBytes };
  } catch (err) {
    console.error('Error updating token:', err);
    throw err;
  }
};
