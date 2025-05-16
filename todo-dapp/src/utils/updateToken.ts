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
    updated: any;
}

const useUpdateToken = async (): Promise<UpdateTokenResult> => {
    try {
        const bytecode = await getBytecode();

        await init(url);
        deserialize(bytecode);
        version();

        // console.log("Bytecode version:", version());
        // console.log("Bytecode:", bytecode);
        // console.log("Bytecode length:", bytecode.length);

        let constants = get_constants(bytecode);
        let updated;

        updated = update_identifiers(bytecode, {
            "MY_COIN": "MY_MODULE",
            "my_coin": "my_module"
        });

        // Update DECIMALS
        updated = update_constants(
            bytecode,
            bcs.u8().serialize(3).toBytes(),
            bcs.u8().serialize(2).toBytes(),
            'U8',
        );

        console.log({ updated1: updated, constants1: constants });

        // Update SYMBOL
        updated = update_constants(
            updated,
            bcs.vector(bcs.u8()).serialize((new TextEncoder().encode('MYC'))).toBytes(),
            bcs.vector(bcs.u8()).serialize(Array.from(new TextEncoder().encode('MY'))).toBytes(),
            'Vector(U8)',
        );

        // Update NAME
        updated = update_constants(
            updated,
            bcs.vector(bcs.u8()).serialize(Array.from(new TextEncoder().encode('My Custom Coin'))).toBytes(),
            bcs.vector(bcs.u8()).serialize(Array.from(new TextEncoder().encode('My Coin'))).toBytes(),
            'Vector(U8)',
        );

        // Update DESCRIPTION
        updated = update_constants(
            updated,
            bcs.vector(bcs.u8()).serialize(stringtoU8Array('My custom coin description')).toBytes(),
            bcs.vector(bcs.u8()).serialize(stringtoU8Array('My coi description')).toBytes(),
            'Vector(U8)',
        );

        // console.assert(updated != bytecode, 'identifiers were not updated!');
        // console.log("Updated bytecode:", updated);
        // console.log("Updated bytecode length:", updated.length);

        console.log({ updated, constants });
        return { constants, updated };
    } catch (error) {
        console.error("Error updating token:", error);
        throw error;
    }
};

export { useUpdateToken };