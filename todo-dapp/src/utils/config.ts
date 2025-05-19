import { config } from "dotenv";

config({});
export const adminPhrase = process.env.OWNER_MNEMONIC_PHRASE as string;


const keys = Object.keys(process.env);
console.log(
    "env contains OWNER_MNEMONIC_PHRASE:",
    keys.includes("OWNER_MNEMONIC_PHRASE")
);