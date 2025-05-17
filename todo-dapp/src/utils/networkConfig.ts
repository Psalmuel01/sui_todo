import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { testnetNftPackageId, testnetTodoListPackageIdShared, testnetTokenPackageId } from "./constants";


const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        todolistPackageId: testnetTodoListPackageIdShared,
        nftPackageId: testnetNftPackageId,
        tokenPackageId: testnetTokenPackageId,
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        todolistPackageId: testnetTodoListPackageIdShared,
        nftPackageId: testnetNftPackageId,
        tokenPackageId: testnetTokenPackageId,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        todolistPackageId: testnetTodoListPackageIdShared,
        nftPackageId: testnetNftPackageId,
        tokenPackageId: testnetTokenPackageId,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
