import { bcs } from '@mysten/bcs';
import init, { deserialize, version } from "@mysten/move-bytecode-template";
import url from '@mysten/move-bytecode-template/move_bytecode_template_bg.wasm?url';
import { update_constants, update_identifiers, get_constants } from '@mysten/move-bytecode-template';
import bytecodeUrl from '/my_coin.mv?url';

async function getBytecode(): Promise<Uint8Array> {
    try {
        const response = await fetch(bytecodeUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch bytecode: ${response.statusText}`);
        }
        return new Uint8Array(await response.arrayBuffer());
    } catch (error) {
        console.error("Error fetching bytecode:", error);
        throw error;
    }
}

const stringtoU8Array = (data: any): Uint8Array => {
    const encoder = new TextEncoder();
    return new Uint8Array(encoder.encode(data));
};

interface UpdateTokenResult {
    constants: any;
    initialBytes: Uint8Array;
    updatedBytes: Uint8Array;
}

const useUpdateToken = async (name: any, symbol: any, description: any, decimal: any): Promise<UpdateTokenResult> => {
    try {
        const initBytecode = await getBytecode();

        await init(url);
        deserialize(initBytecode);
        version();

        // console.log("Bytecode version:", version());
        // console.log("Bytecode:", bytecode);
        // console.log("Bytecode length:", bytecode.length);

        let constants = get_constants(initBytecode);
        let updatedBytes;

        updatedBytes = update_identifiers(initBytecode, {
            "MY_COIN": "MY_MODULE",
            "my_coin": "my_module"
        });

        // Update DECIMALS
        updatedBytes = update_constants(
            initBytecode,
            bcs.u8().serialize(decimal).toBytes(), // new value
            bcs.u8().serialize(2).toBytes(), // current value
            'U8',
        );

        console.log({ updatedBytes1: updatedBytes, constants1: constants });

        // Update SYMBOL
        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize((new TextEncoder().encode(symbol))).toBytes(),
            bcs.vector(bcs.u8()).serialize(Array.from(new TextEncoder().encode('MY'))).toBytes(),
            'Vector(U8)',
        );

        // Update NAME
        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(Array.from(new TextEncoder().encode(name))).toBytes(),
            bcs.vector(bcs.u8()).serialize(Array.from(new TextEncoder().encode('My Coin'))).toBytes(),
            'Vector(U8)',
        );

        // Update DESCRIPTION
        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(stringtoU8Array(description)).toBytes(),
            bcs.vector(bcs.u8()).serialize(stringtoU8Array('My coi description')).toBytes(),
            'Vector(U8)',
        );

        console.assert(updatedBytes != initBytecode, 'identifiers were not updatedBytes!');
        console.log("UpdatedBytes bytecode:", updatedBytes);
        console.log("UpdatedBytes bytecode length:", updatedBytes.length);

        console.log({ updatedBytes, constants });
        return { constants, initialBytes: initBytecode, updatedBytes };

    } catch (error) {
        console.error("Error updating token:", error);
        throw error;
    }
};
export { useUpdateToken };