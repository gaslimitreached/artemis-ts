import { Subject } from "rxjs";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

import { LogCollector, EventScope } from "@/core/collectors/log";
import { UniswapPairCreated } from '@/strategies/uniswap-pair-created'

// todo: move to config/setup
const client = createPublicClient({
  chain: mainnet,
  transport: http(process.env.ETH_RPC),
});

// create log channel
const logs: Subject<any[]> = new Subject();

// pair created events from uniswap factory v2
const filter: EventScope = {
  address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  event: {
    name: "PairCreated",
    type: "event",
    inputs: [
      { type: "address", name: "token0", indexed: true },
      { type: "address", name: "token1", indexed: true },
      { type: "address", name: "pair", indexed: false },
      { type: "uint256", name: "noname", indexed: false },
    ],
  },
}

const collectors: any[] = [];
collectors.push(new LogCollector(client, filter, logs));

const strategy = new UniswapPairCreated(client);
strategy.processEvent({ pairCreated: logs });

// start collecting filtered events
collectors.forEach((collector) => collector.start());

