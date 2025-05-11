import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Box, Container, Flex, Heading, Link, Text } from '@radix-ui/themes';
import { useState } from 'react';
import { useNetworkVariable } from './networkConfig';
import { Transaction } from '@mysten/sui/transactions';
import { ClipLoader } from 'react-spinners';

export default function Nft() {
    const account = useCurrentAccount();
    const nftPackageId = useNetworkVariable("nftPackageId");
    const {
        mutate: signAndExecute,
        isSuccess,
        isPending,
    } = useSignAndExecuteTransaction();
    const suiClient = useSuiClient();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [nftId, setNftId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ name, description, url });
        try {
            const tx = new Transaction();
            tx.moveCall({
                arguments: [
                    tx.pure.string(name),
                    tx.pure.string(description),
                    tx.pure.string(url)
                ],
                target: `${nftPackageId}::my_nft::mint_to_sender`,
            });

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
                            },
                        });
                        console.log("List created successfully:", effects);
                        const nftId = effects?.created?.[0]?.reference?.objectId!;
                        console.log(effects?.created);
                        setNftId(nftId);
                    },
                }
            );
        } catch (e) {
            console.error('Failed to create todo list:', e);
        }
    };
    return (
        <Container my="4" style={{ color: "#1e293b" }}>
            <Heading my="5" size="4">
                Create New NFT
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
                                    Description
                                </Text>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid var(--gray-a6)',
                                    }}
                                    rows={3}
                                    required
                                />
                            </Box>
                            <Box>
                                <Text as="label" size="2" weight="medium" mb="2">
                                    URL
                                </Text>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
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
                                {isPending ? <>Creating NFT <ClipLoader size={20} /></> : "Create your NFT"}
                            </button>
                        </Flex>
                    </form>
                    {isSuccess && (
                        <Box mt="4" style={{ color: "#22c55e", display: "flex", flexDirection: "column", gap: "4px", fontWeight: "semibold" }}>
                            <Text>NFT created successfully!</Text>
                            <Text>NFT ID: {nftId || "loading id..."}</Text>
                            {nftId && (
                                <Link href={`https://suiscan.xyz/testnet/object/${nftId}`}>View NFT</Link>
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
