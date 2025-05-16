import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from './utils/networkConfig';
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@radix-ui/themes";
import ClipLoader from "react-spinners/ClipLoader";


export function CreateTodo({ onCreated }: { onCreated: (id: string) => void }) {
    const todolistPackageId = useNetworkVariable("todolistPackageId");
    const {
        mutate: signAndExecute,
        isSuccess,
        isPending,
    } = useSignAndExecuteTransaction();
    const suiClient = useSuiClient();
    const handleCreate = () => {
        try {
            const tx = new Transaction();
            tx.moveCall({
                arguments: [],
                target: `${todolistPackageId}::todo_list::new`,
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
                        const listId = effects?.created?.[0]?.reference?.objectId!;

                        onCreated(listId);
                    },
                },);
        } catch (e) {
            console.error('Failed to create todo list:', e);
        }
    };

    return (
        <Button
            size="3"
            onClick={handleCreate}
            disabled={isSuccess || isPending}
        >
            {isSuccess || isPending ? <>Loading <ClipLoader size={20} /></> : "Create Counter"}
        </Button>
    );
}
