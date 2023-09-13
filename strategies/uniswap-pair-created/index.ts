import { join } from "node:path";
import { mergeMap, of, Subject } from "rxjs";
import { PublicClient } from "viem";

import { toAbi } from "@/core/utils";

const pairsABI = await toAbi(join(__dirname, 'abis', 'pair.abi.json'));

type Event = {
  pairCreated: Subject<any> 
}

class UniswapPairCreated {
  private client: PublicClient;

  constructor(client: PublicClient) {
    this.client = client;
  }

  syncState() {}

  processEvent({ pairCreated }: Event) {
    pairCreated
      .pipe(mergeMap(logs => of(...logs)))
      .subscribe({
        next: async (res: any) => {
          console.log(res);
          const reserves = await this.getReserves(res.args.pair);
          console.log(reserves);
        }
      });
  }

  getReserves(address: `0x${string}`) {
    return this.client.readContract({
      address,
      abi: pairsABI,
      functionName: 'getReserves',
    });
  }
}

export { UniswapPairCreated };

