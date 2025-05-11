import { useCurrentAccount } from "@mysten/dapp-kit";
import { Container, Flex, Heading, Text, Box, Separator } from "@radix-ui/themes";
// import { OwnedObjects } from "./OwnedObjects";
// import { useNetworkVariable } from "./networkConfig";
import { CreateTodo } from "./CreateTodo";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { useState } from "react";
import { TodoList } from "./TodoList";
import { OwnedObjects } from "./OwnedObjects";

export function Todo() {
  const account = useCurrentAccount();
  const [todoId, setTodoId] = useState(() => {
    const hash = window.location.hash.slice(1);
    // const hash = "0x2dcfc752915f15069514474b9092074a4e30f306fa9a76ac56b7a12f845d5f6f";
    return isValidSuiObjectId(hash) ? hash : null;
  });

  return (
    <Container my="4" style={{ color: "#1e293b" }}>
      <Heading mb="4" size="4">
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

      <Separator my="4" size="4" />

      {account && (todoId ? (
        <TodoList listId={todoId} />)
        : (
          <CreateTodo onCreated={(id) => {
            window.location.hash = id;
            setTodoId(id);
          }} />
        )
      )}
      <OwnedObjects />
    </Container>
  );
}