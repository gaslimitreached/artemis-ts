import { createPublicClient, webSocket } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: webSocket(
    process.env.ETH_WSS,
  ),
});

client.watchEvent({
  event: {
    name: "Transfer",
    type: "event",
    inputs: [
      { type: "address", name: "from", indexed: true },
      { type: "address", name: "to", indexed: true },
      { type: "uint256", name: "tokenId", indexed: true },
    ],
  },
  args: {
    from: "0x0000000000000000000000000000000000000000",
  },
  strict: true,

  onLogs(logs) {
    for (const log of logs) {
      console.log(
        `${log.args.to} minted ${log.args.tokenId} on ${log.address}`,
      );
    }
  },
});

