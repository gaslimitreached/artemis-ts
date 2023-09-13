import {
  PublicClient,
  Transaction,
  serializeTransaction,
} from "viem";

type GasBidInfo = {
  totalProfit: bigint,
  bidPercentage: number,
}

type MempoolAction = {
  tx: Transaction,
  gasBidInfo?: GasBidInfo,
}

class MempoolExecutor {
  private client: PublicClient;

  constructor(client: PublicClient) {
    this.client = client;
  }

  public async execute(action: MempoolAction) {
    // set transaction gas price
    if (action.gasBidInfo) {
      const blockNumber = await this.client.getBlockNumber();

      const gasUsage = await this.client.estimateGas({
        account: action.tx.from,
        to: action.tx?.to ?? undefined,
        value: action.tx?.value,
        maxFeePerGas: action.tx?.maxFeePerGas,
        maxPriorityFeePerGas: action.tx?.maxPriorityFeePerGas,
        blockNumber,
      });

      const breakEven = action.gasBidInfo.totalProfit / gasUsage;
      action.tx.gasPrice = breakEven * BigInt(action.gasBidInfo.bidPercentage) / 100n;
    } else {
      action.tx.gasPrice = await this.client.getGasPrice();
    }

    const serializedTransaction = serializeTransaction({
      chainId: this.client.chain?.id ?? 1,
      gas: action.tx.gasPrice,
      maxFeePerGas: action.tx.maxFeePerGas,
      maxPriorityFeePerGas: action.tx.maxPriorityFeePerGas,
      nonce: action.tx.nonce,
      to: action.tx.to ?? undefined,
      value: action.tx.value,
    })

    return await this.client.sendRawTransaction({ serializedTransaction });
  }
}

export { MempoolExecutor, MempoolAction };

