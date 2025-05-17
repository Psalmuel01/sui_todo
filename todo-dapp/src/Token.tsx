import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Box, Container, Flex, Heading, Link, Text } from '@radix-ui/themes';
import { useState } from 'react';
import { useNetworkVariable } from './utils/networkConfig';
import { ClipLoader } from 'react-spinners';
import { useUpdateToken } from './utils/updateToken';
import { Transaction } from '@mysten/sui/transactions';
import { normalizeSuiObjectId } from '@mysten/sui/utils';

export default function Token() {
    const account = useCurrentAccount();
    const tokenPackageId = useNetworkVariable("tokenPackageId");

    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [description, setDescription] = useState('');
    const [decimal, setDecimal] = useState('');
    const [newTokenId, setNewTokenId] = useState('');
    const {
        mutate: signAndExecute,
        isSuccess,
        isPending,
    } = useSignAndExecuteTransaction();
    const suiClient = useSuiClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ name, symbol, description, decimal });
        useUpdateToken(name, symbol, description, decimal)
            .then(({ constants, initialBytes, updatedBytes }) => {
                console.log("Updated Token:", { constants, initialBytes, updatedBytes });
            })

        const { updatedBytes } = await useUpdateToken(name, symbol, description, decimal);
        publishNewBytecode(updatedBytes, tokenPackageId);

    };


    const publishNewBytecode = async (updatedBytes: Uint8Array, packageId: any) => {
        try {
            const tx = new Transaction();
            tx.setGasBudget(100000000);
            const [upgradeCap] = tx.publish({
                modules: [[...updatedBytes]],
                dependencies: [normalizeSuiObjectId("0x1"), normalizeSuiObjectId("0x2")],
            })
            tx.transferObjects([upgradeCap], tx.pure("address", account!.address));

            let newPackageId: any;

            signAndExecute(
                {
                    transaction: tx,
                },
                {
                    onSuccess: async ({ digest }) => {
                        const { effects } = await suiClient.waitForTransaction({
                            digest: digest,
                            options: {
                                showEffects: true,
                                showEvents: true,
                                showObjectChanges: true,
                                showBalanceChanges: true,
                                showInput: true,
                            },
                        });
                        console.log({ digest, effects });
                        if (effects?.status.status === "success") {
                            console.log("New asset published! Digest:", digest);
                            newPackageId = effects.created?.find(
                                (item) => item.owner === "Immutable"
                            )?.reference.objectId;
                            console.log("New Package ID:", newPackageId);
                            setNewTokenId(newPackageId);
                        } else {
                            console.log("Error: ", effects?.status);
                            throw new Error("Publishing failed");
                        }
                        console.log("New bytecode published successfully:", effects);
                    },
                },
            );
            return { isSuccess, isPending, newPackageId };
        } catch (error) {
            console.error("Error publishing new bytecode:", error);
            throw error;
        }
    };

    return (
        <Container my="4" style={{ color: "#1e293b" }}>
            <Heading my="5" size="4">
                Create New token
            </Heading>
            {account ? (
                <Box
                    p="4"
                    style={{
                        background: "var(--gray-a2)",
                        borderRadius: "8px",
                        border: "1px solid var(--gray-a3)"
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Flex direction="column" gap="4">
                            <Box>
                                <Text as="label" size="2" weight="medium" mb="2">
                                    Name
                                </Text>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid var(--gray-a6)',
                                    }}
                                    required
                                />
                            </Box>
                            <Box>
                                <Text as="label" size="2" weight="medium" mb="2">
                                    Symbol
                                </Text>
                                <input
                                    type="text"
                                    value={symbol}
                                    onChange={(e) => setSymbol(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid var(--gray-a6)',
                                    }}
                                    required
                                />
                            </Box>
                            <Box>
                                <Text as="label" size="2" weight="medium" mb="2">
                                    Description
                                </Text>
                                <input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid var(--gray-a6)',
                                    }}
                                    required
                                />
                            </Box>
                            <Box>
                                <Text as="label" size="2" weight="medium" mb="2">
                                    Decimal
                                </Text>
                                <input
                                    type="number"
                                    value={decimal}
                                    onChange={(e) => setDecimal(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid var(--gray-a6)',
                                    }}
                                    required
                                />
                            </Box>
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
                                disabled={isSuccess || isPending}
                            >
                                {isPending ? <>Creating token <ClipLoader size={20} /></> : "Create your token"}
                            </button>
                        </Flex>
                    </form>
                    {isSuccess && (
                        <Box mt="4" style={{ color: "#22c55e", display: "flex", flexDirection: "column", gap: "4px", fontWeight: "semibold" }}>
                            <Text>{isSuccess && "token created successfully!"}</Text>
                            <Text>token ID: {newTokenId || "loading id..."}</Text>
                            {newTokenId && (
                                <Link href={`https://suiscan.xyz/testnet/object/${newTokenId}`}>View token</Link>
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