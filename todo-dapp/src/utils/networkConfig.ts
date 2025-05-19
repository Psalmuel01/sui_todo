import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { testnetNftPackageId, testnetRegTokenPackageId, testnetTodoListPackageIdShared, testnetTokenPackageId } from "./constants";


const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        todolistPackageId: testnetTodoListPackageIdShared,
        nftPackageId: testnetNftPackageId,
        tokenPackageId: testnetTokenPackageId,
        regTokenPackageId: testnetRegTokenPackageId,
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        todolistPackageId: testnetTodoListPackageIdShared,
        nftPackageId: testnetNftPackageId,
        tokenPackageId: testnetTokenPackageId,
        regTokenPackageId: testnetRegTokenPackageId,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        todolistPackageId: testnetTodoListPackageIdShared,
        nftPackageId: testnetNftPackageId,
        tokenPackageId: testnetTokenPackageId,
        regTokenPackageId: testnetRegTokenPackageId,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
