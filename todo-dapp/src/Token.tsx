import {
    useCurrentAccount,
    useSignAndExecuteTransaction,
    useSuiClient
} from '@mysten/dapp-kit';
import {
    Box,
    Container,
    Flex,
    Heading,
    Link,
    Text
} from '@radix-ui/themes';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { Transaction } from '@mysten/sui/transactions';
import { normalizeSuiObjectId } from '@mysten/sui/utils';
import { useUpdateToken } from './utils/updateToken';
// import { useNetworkVariable } from './utils/networkConfig';

export default function Token() {
    const account = useCurrentAccount();
    // const tokenPackageId = useNetworkVariable("tokenPackageId");

    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [description, setDescription] = useState('');
    const [decimal, setDecimal] = useState('');
    const [newTokenId, setNewTokenId] = useState('');

    const { mutate: signAndExecute, isSuccess, isPending } = useSignAndExecuteTransaction();
    const suiClient = useSuiClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { updatedBytes } = await useUpdateToken(name, symbol, description, Number(decimal));
            await publishNewBytecode(updatedBytes);
        } catch (err) {
            console.error("Token creation failed:", err);
        }
    };

    const publishNewBytecode = async (updatedBytes: Uint8Array) => {
        const tx = new Transaction();
        tx.setGasBudget(100_000_000);

        const [upgradeCap] = tx.publish({
            modules: [[...updatedBytes]],
            dependencies: [normalizeSuiObjectId("0x1"), normalizeSuiObjectId("0x2")],
        });

        tx.transferObjects([upgradeCap], tx.pure("address", account!.address));

        signAndExecute(
            { transaction: tx },
            {
                onSuccess: async ({ digest }) => {
                    const { effects } = await suiClient.waitForTransaction({
                        digest,
                        options: {
                            showEffects: true,
                            showEvents: true,
                            showObjectChanges: true,
                            showBalanceChanges: true,
                            showInput: true,
                        },
                    });

                    if (effects?.status.status === "success") {
                        const newPkgId = effects.created?.find(
                            item => item.owner === "Immutable"
                        )?.reference.objectId;

                        setNewTokenId(newPkgId || '');
                    } else {
                        throw new Error("Publishing failed");
                    }
                },
                onError: (err) => {
                    console.error("Publish transaction failed:", err);
                }
            }
        );
    };

    return (
        <Container my="4" style={{ color: "#1e293b" }}>
            <Heading my="5" size="4">Create New Token</Heading>
            {account ? (
                <Box
                    p="4"
                    style={{
                        background: "var(--gray-a2)",
                        borderRadius: "8px",
                        border: "1px solid var(--gray-a3)",
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Flex direction="column" gap="4">
                            {[["Name", name, setName], ["Symbol", symbol, setSymbol], ["Description", description, setDescription], ["Decimal", decimal, setDecimal]].map(
                                ([label, value, setValue], i) => (
                                    <Box key={i}>
                                        <Text as="label" size="2" weight="medium" mb="2">{label as string}</Text>
                                        <input
                                            type={label === "Decimal" ? "number" : "text"}
                                            value={value as string}
                                            onChange={(e) => (setValue as Function)(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '6px',
                                                border: '1px solid var(--gray-a6)',
                                            }}
                                            required
                                        />
                                    </Box>
                                )
                            )}
                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    marginTop: '16px',
                                    backgroundColor: 'var(--indigo-9)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                }}
                                disabled={isPending}
                            >
                                {isPending ? <>Creating token <ClipLoader size={20} /></> : "Create your token"}
                            </button>
                        </Flex>
                    </form>
                    {isSuccess && (
                        <Box mt="4" style={{ color: "#22c55e", display: "flex", flexDirection: "column", gap: "4px", fontWeight: "semibold" }}>
                            <Text>Token created successfully!</Text>
                            <Text>Token ID: {newTokenId || "Loading ID..."}</Text>
                            {newTokenId && (
                                <Link href={`https://suiscan.xyz/testnet/object/${newTokenId}`} target="_blank">
                                    View token
                                </Link>
                            )}
                        </Box>
                    )}
                </Box>
            ) : (
                <Text>Please connect your wallet</Text>
            )}
        </Container>
    );
}
