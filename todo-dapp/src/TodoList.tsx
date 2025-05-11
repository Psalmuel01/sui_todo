import { useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { Heading, Flex, Box, Button, Dialog, TextField, Text, IconButton } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { CheckIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { Transaction } from "@mysten/sui/transactions";
import { ClipLoader } from "react-spinners";
import { SuiObjectData } from "@mysten/sui/client";

export function TodoList({ listId }: { listId: string }) {
    const todolistPackageId = useNetworkVariable("todolistPackageId");
    const suiClient = useSuiClient();
    // const account = useCurrentAccount();
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTodoText, setNewTodoText] = useState("");
    const [todos, setTodos] = useState([]);

    const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
        id: listId,
        options: {
            showContent: true,
            showOwner: true,
        },
    });

    // console.log({ data, refetch });

    const [waitingForTxn, setWaitingForTxn] = useState("");

    const executeMoveCall = (method: "add" | "remove", item?: string, index?: number) => {
        setWaitingForTxn(method);

        const tx = new Transaction();

        if (method === "add") {
            tx.moveCall({
                arguments: [tx.object(listId), tx.pure.string(item || "")],
                target: `${todolistPackageId}::todo_list::add`,
            });
        } else {
            tx.moveCall({
                arguments: [tx.object(listId), tx.pure.u64(index || 0)],
                target: `${todolistPackageId}::todo_list::remove`,
            });
        }

        signAndExecute(
            {
                transaction: tx,
            },
            {
                onSuccess: (tx) => {
                    console.log("Transaction successful:", tx);

                    suiClient.waitForTransaction({ digest: tx.digest }).then(async () => {
                        await refetch();
                        setWaitingForTxn("");
                    });
                },
                onError: (error) => {
                    console.error("Transaction failed:", error);
                    setWaitingForTxn("");
                }
            },
        );
    };

    function getCounterFields(data: SuiObjectData) {
        if (data.content?.dataType !== "moveObject") {
            return null;
        }

        return data.content.fields as { id: number; items: string[] };
    }

    // const ownedByCurrentAccount =
    //     getCounterFields(data.data)?.owner === account?.address;

    useEffect(() => {
        if (data) {
            const todos = getCounterFields(data.data)?.items;
            console.log({ todosss: todos });
            setTodos(todos);
        }
    }, [data]);

    const handleAddTodo = () => {
        if (newTodoText.trim()) {
            setIsModalOpen(false);
            executeMoveCall("add", newTodoText);
        }
        setNewTodoText("");
    };

    // Delete todo handler
    const handleDeleteTodo = (todoId: string) => {
        executeMoveCall("remove", todoId);
    };

    if (isPending) {
        return <Text>Loading todo list...</Text>;
    }

    if (error) {
        return <Text color="red">Error loading todo list: {error.message}</Text>;
    }

    if (!data.data) {
        return <Text>Todo list not found</Text>;
    }

    return (
        <Box>
            <Flex justify="between" align="center" mb="4">
                <Heading size="4" style={{ color: "#1e293b" }}>
                    Your Tasks
                </Heading>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    color="blue"
                    variant="solid"
                    disabled={waitingForTxn !== ""}
                    style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                    {waitingForTxn === "add" ? (
                        <ClipLoader size={20} />
                    ) : (
                        <><PlusIcon /> Add Task</>)}
                </Button>
            </Flex>

            {todos.length === 0 ? (
                <Box
                    p="6"
                    style={{
                        backgroundColor: "var(--gray-a2)",
                        borderRadius: "8px",
                        textAlign: "center"
                    }}
                >
                    <Text size="2" style={{ color: "#64748b" }}>No tasks yet. Add one to get started!</Text>
                </Box>
            ) : (
                <Box style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
                    {todos.map((todo, index) => (
                        <Box
                            key={index}
                            p="3"
                            style={{
                                backgroundColor: "var(--gray-a2)",
                                borderRadius: "8px",
                                border: "1px solid var(--gray-a3)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <Flex align="center" gap="2">
                                <Box
                                    style={{
                                        width: "10px",
                                        height: "10px",
                                        borderRadius: "4px",
                                        border: "1px solid var(--blue-9)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer"
                                    }}
                                >
                                    {todo && <CheckIcon color="white" />}
                                </Box>
                                <Text
                                    style={{
                                        color: "#1e293b"
                                    }}
                                >
                                    {todo}
                                </Text>
                            </Flex>
                            <IconButton
                                color="red"
                                variant="ghost"
                                onClick={() => handleDeleteTodo(index.toString())}
                            >
                                <TrashIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )}

            <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Dialog.Content style={{ maxWidth: "450px" }}>
                    <Dialog.Title>Add New Task</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                        Enter a task description to add to your list.
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Task Description
                            </Text>
                            <TextField.Root
                                placeholder="What needs to be done?"
                                value={newTodoText}
                                onChange={(e) => setNewTodoText(e.target.value)}
                            />
                        </label>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray">
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Button onClick={handleAddTodo} disabled={newTodoText === ""}>
                            Add Task
                        </Button>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </Box>
    );
}