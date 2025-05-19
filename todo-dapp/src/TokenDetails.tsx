import {
    useSignAndExecuteTransaction,
    useSuiClient
} from '@mysten/dapp-kit';
import {
    Box,
    Container,
    Flex,
    Heading,
    Card,
    Text,
    Button,
    Separator
} from '@radix-ui/themes';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { Transaction } from '@mysten/sui/transactions';

interface TokenDetailsProps {
    tokenData: {
        name: string;
        symbol: string;
        description: string;
        decimal: string;
        newPkgId: string;
        txId: string;
        treasuryCap: string;
    };
    onBack: () => void;
}

export default function TokenDetails({
    tokenData,
    onBack
}: TokenDetailsProps) {
    const { name, symbol, description, decimal, newPkgId, txId, treasuryCap } = tokenData;
    const [mintAmount, setMintAmount] = useState('');
    const [mintRecipient, setMintRecipient] = useState('');
    const [burnAmount, setBurnAmount] = useState('');
    const [mintSuccess, setMintSuccess] = useState(false);
    const [burnSuccess, setBurnSuccess] = useState(false);

    const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
    const suiClient = useSuiClient();

    const handleMint = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Minting with values:", {
            treasuryCap,
            amount: mintAmount,
            recipient: mintRecipient
        });

        const tx = new Transaction();
        tx.setGasBudget(100_000_000);

        // Call the mint function on the Coin contract
        tx.moveCall({
            target: `${newPkgId}::coin::mint`,
            arguments: [
                tx.object(treasuryCap),
                tx.pure(Number(mintAmount)),
                tx.pure(mintRecipient),
            ],
        });

        signAndExecute(
            { transaction: tx },
            {
                onSuccess: async ({ digest }) => {
                    const res = await suiClient.waitForTransaction({
                        digest,
                        options: { showEffects: true }
                    });

                    if (res.effects?.status.status === "success") {
                        console.log("Mint successful:", res);
                        setMintSuccess(true);
                        setTimeout(() => setMintSuccess(false), 3000);
                    }
                },
                onError: (err) => {
                    console.error("Mint transaction failed:", err);
                }
            }
        );
    };

    const handleBurn = async (e) => {
        e.preventDefault();
        console.log("Burning with values:", {
            treasuryCap,
            amount: burnAmount
        });

        const tx = new Transaction();
        tx.setGasBudget(100_000_000);

        // Call the burn function on the Coin contract
        tx.moveCall({
            target: `${newPkgId}::coin::burn`,
            arguments: [
                tx.object(treasuryCap),
                tx.pure(Number(burnAmount)),
            ],
        });

        signAndExecute(
            { transaction: tx },
            {
                onSuccess: async ({ digest }) => {
                    const res = await suiClient.waitForTransaction({
                        digest,
                        options: { showEffects: true }
                    });

                    if (res.effects?.status.status === "success") {
                        console.log("Burn successful:", res);
                        setBurnSuccess(true);
                        setTimeout(() => setBurnSuccess(false), 3000);
                    }
                },
                onError: (err) => {
                    console.error("Burn transaction failed:", err);
                }
            }
        );
    };

    return (
        <Container my="4">
            <Button variant="soft" onClick={onBack} mb="4">
                ← Back to Create
            </Button>

            <Card size="3" style={{ overflow: "visible", color: "black" }}>
                <Flex direction="column" gap="3">
                    <Box>
                        <Heading size="6" className="gradient-text" style={{
                            background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}>
                            {name} Token ({symbol})
                        </Heading>
                        <Text size="2">{description}</Text>
                    </Box>

                    <Box style={{ background: "var(--gray-a2)", borderRadius: "8px", padding: "16px" }}>
                        <Flex direction="column" gap="2">
                            <InfoRow label="Token Name" value={name} />
                            <InfoRow label="Symbol" value={symbol} />
                            <InfoRow label="Decimals" value={decimal} />
                            <InfoRow label="Package ID" value={newPkgId} isTruncated />
                            <InfoRow label="Treasury Cap" value={treasuryCap} isTruncated />
                            <InfoRow
                                label="Explorer"
                                value={
                                    <Text as="span" color="blue">
                                        <a href={`https://suiscan.xyz/testnet/object/${newPkgId}`} target="_blank" rel="noopener noreferrer" style={{
                                            color: 'var(--blue-9)',
                                            textDecoration: 'none'
                                        }}>
                                            View on SuiScan
                                        </a>
                                    </Text>
                                }
                            />
                        </Flex>
                    </Box>

                    <Separator size="4" />

                    <Flex gap="4" direction={{ initial: 'column', sm: 'row' }}>
                        <Box style={{ flex: 1 }}>
                            <Heading size="3" mb="2">Mint Tokens</Heading>
                            <form onSubmit={handleMint}>
                                <Flex direction="column" gap="2">
                                    <input
                                        placeholder="Treasury Cap"
                                        value={treasuryCap}
                                        disabled
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            border: "1px solid var(--gray-6)",
                                            fontSize: "14px",
                                            backgroundColor: "var(--gray-2)"
                                        }}
                                    />

                                    <input
                                        placeholder="Amount"
                                        value={mintAmount}
                                        onChange={(e) => setMintAmount(e.target.value)}
                                        type="number"
                                        required
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            border: "1px solid var(--gray-6)",
                                            fontSize: "14px"
                                        }}
                                    />

                                    <input
                                        placeholder="Recipient Address"
                                        value={mintRecipient}
                                        onChange={(e) => setMintRecipient(e.target.value)}
                                        required
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            border: "1px solid var(--gray-6)",
                                            fontSize: "14px"
                                        }}
                                    />

                                    <Button
                                        type="submit"
                                        color="indigo"
                                        disabled={isPending}
                                    >
                                        {isPending ? <ClipLoader size={16} color="white" /> : "Mint"}
                                    </Button>

                                    {mintSuccess && (
                                        <Text color="green" size="2" weight="medium">
                                            Mint successful!
                                        </Text>
                                    )}
                                </Flex>
                            </form>
                        </Box>

                        <Box style={{ flex: 1 }}>
                            <Heading size="3" mb="2">Burn Tokens</Heading>
                            <form onSubmit={handleBurn}>
                                <Flex direction="column" gap="2">
                                    <input
                                        placeholder="Treasury Cap"
                                        value={treasuryCap}
                                        disabled
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            border: "1px solid var(--gray-6)",
                                            fontSize: "14px",
                                            backgroundColor: "var(--gray-2)"
                                        }}
                                    />

                                    <input
                                        placeholder="Amount"
                                        value={burnAmount}
                                        onChange={(e) => setBurnAmount(e.target.value)}
                                        type="number"
                                        required
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            border: "1px solid var(--gray-6)",
                                            fontSize: "14px"
                                        }}
                                    />

                                    <Button
                                        type="submit"
                                        color="red"
                                        disabled={isPending}
                                    >
                                        {isPending ? <ClipLoader size={16} color="white" /> : "Burn"}
                                    </Button>

                                    {burnSuccess && (
                                        <Text color="green" size="2" weight="medium">
                                            Burn successful!
                                        </Text>
                                    )}
                                </Flex>
                            </form>
                        </Box>
                    </Flex>
                </Flex>
            </Card>
        </Container>
    );
}

function InfoRow({ label, value, isTruncated = false }: { label: string, value: string | React.ReactNode, isTruncated?: boolean }) {
    const displayValue = isTruncated && typeof value === 'string'
        ? `${value.substring(0, 8)}...${value.substring(value.length - 8)}`
        : value;

    const copyToClipboard = async () => {
        if (typeof value === 'string') {
            await navigator.clipboard.writeText(value);
        }
    };

    return (
        <Flex justify="between" align="center">
            <Text size="2" weight="medium">{label}:</Text>
            <Flex align="center" gap="1">
                <Text size="2">{displayValue}</Text>
                {isTruncated && (
                    <Button
                        variant="ghost"
                        size="1"
                        onClick={copyToClipboard}
                    >
                        📋
                    </Button>
                )}
            </Flex>
        </Flex>
    );
}