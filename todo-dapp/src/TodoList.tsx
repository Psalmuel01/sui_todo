import { useCurrentAccount } from "@mysten/dapp-kit";
import { Container, Flex, Heading, Text, Box, Separator } from "@radix-ui/themes";
import { OwnedObjects } from "./OwnedObjects";

export function TodoList() {
  const account = useCurrentAccount();

  return (
    <Container my="4">
      <Heading mb="4" size="4" style={{ color: "#1e293b" }}>
        Wallet Status
      </Heading>

      <Box 
        p="4" 
        style={{ 
          background: "var(--gray-a2)", 
          borderRadius: "8px",
          border: "1px solid var(--gray-a3)"
        }}
      >
        {account ? (
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <Box style={{ 
                width: "8px", 
                height: "8px", 
                borderRadius: "50%", 
                background: "#22c55e" 
              }} />
              <Text weight="medium" style={{ color: "#22c55e" }}>
                Wallet connected
              </Text>
            </Flex>
            <Text size="2" style={{ wordBreak: "break-all", color: "#64748b" }}>
              Address: {account.address}
            </Text>
          </Flex>
        ) : (
          <Flex align="center" gap="2">
            <Box style={{ 
              width: "8px", 
              height: "8px", 
              borderRadius: "50%", 
              background: "#ef4444" 
            }} />
            <Text weight="medium" style={{ color: "#ef4444" }}>
              Wallet not connected
            </Text>
          </Flex>
        )}
      </Box>

      <Separator my="6" size="4" />

      
      <OwnedObjects />
    </Container>
  );
}