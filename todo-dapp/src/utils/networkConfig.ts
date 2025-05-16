import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

// const testnetTodoListPackageId = "0x67564e0bf92fd1e4881a364f9331c55080ba4175f11061b190e25c34112e3ecf"
const testnetTodoListPackageIdShared = "0xc530914bd45b454baf52077e2707174d00ea165a821dad13b63ceacc9398f2c2"
const testnetNftPackageId = "0xd2bfa388fa7ba1ee3cf9f15de83f9bf8323f821bc11e1c4163defdabe43352c3"
const testnetTokenPackageId = "0xf956684f0de72b3f14195ae80c1c6189cefaa690607a868bdf2ee742bf164b62"

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
