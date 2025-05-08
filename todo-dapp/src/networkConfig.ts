import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const testnetTodoListPackageId = "0x67564e0bf92fd1e4881a364f9331c55080ba4175f11061b190e25c34112e3ecf"
const testnetTodoListPackageIdShared = "0xc530914bd45b454baf52077e2707174d00ea165a821dad13b63ceacc9398f2c2"

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        todolistPackageId: testnetTodoListPackageId,
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        todolistPackageId: testnetTodoListPackageIdShared,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        todolistPackageId: testnetTodoListPackageId,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
