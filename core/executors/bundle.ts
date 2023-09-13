import MevShareClient from "@flashbots/mev-share-client";
import { TransactionLike, Wallet } from "ethers";

type FlashbotsBundle = TransactionLike[];

class BundleExecutor {
  private client: MevShareClient;
  private signer: Wallet;

  constructor(client: MevShareClient, signer: Wallet) {
    this.client = client;
    this.signer = signer;
  }

  public async execute(action: FlashbotsBundle, block: number) {
    const body = await Promise.all(action.map(async (tx: TransactionLike) => ({
      tx: await this.signer.signTransaction(tx),
      canRevert: false,
    })));

    return await this.client.sendBundle({
      body,
      inclusion: {
        block,
        maxBlock: block + 20,
      }
    });
  }
}

export { BundleExecutor };

