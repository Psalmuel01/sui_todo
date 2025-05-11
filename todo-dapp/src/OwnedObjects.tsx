import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Flex, Heading, Text, Box } from "@radix-ui/themes";

export function OwnedObjects() {
  const account = useCurrentAccount();
  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address as string,
    },
    {
      enabled: !!account,
    },
  );

  if (!account) {
    return null;
  }

  if (error) {
    return (
      <Box p="4" style={{
        background: "#fee2e2",
        borderRadius: "8px",
        border: "1px solid #fecaca"
      }}>
        <Text weight="medium" style={{ color: "#b91c1c" }}>
          Error: {error.message}
        </Text>
      </Box>
    );
  }

  if (isPending || !data) {
    return (
      <Flex justify="center" align="center" p="6">
        <Text size="2" style={{ color: "#64748b" }}>
          Loading objects...
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="4" mt={"4"}>
      <Heading size="3" style={{ color: "#1e293b" }}>
        {data.data.length === 0
          ? "No objects owned"
          : `Objects owned (${data.data.length})`}
      </Heading>

      {data.data.length === 0 ? (
        <Box p="4" style={{
          background: "var(--gray-a2)",
          borderRadius: "8px",
          border: "1px solid var(--gray-a3)",
          textAlign: "center"
        }}>
          <Text size="2" style={{ color: "#64748b" }}>
            No objects owned by the connected wallet
          </Text>
        </Box>
      ) : (
        <Flex direction="column" gap="2">
          {data.data.map((object) => (
            <Box
              key={object.data?.objectId}
              px="3"
              style={{
                background: "var(--gray-a2)",
                borderRadius: "8px",
                border: "1px solid var(--gray-a3)"
              }}
            >
              <Text size="2" style={{ wordBreak: "break-all", color: "#334155" }}>
                Object ID: {object.data?.objectId}
              </Text>
            </Box>
          ))}
        </Flex>
      )}
    </Flex>
  );
}