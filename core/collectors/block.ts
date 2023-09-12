import { Subject } from 'rxjs';
import {
  Chain,
  createPublicClient,
  PublicClient,
  webSocket
} from 'viem';

class BlockCollector {
  private client: PublicClient; 
  private subject: Subject<BigInt>;

  constructor(url: string, chain: Chain, subject: Subject<BigInt>) {
    this.subject = subject;

    this.client = createPublicClient({
      chain: chain,
      transport: webSocket(url, {
        retryCount: 2,
      }),
    });
  }

  public start() {
    return this.client.watchBlockNumber({
      onBlockNumber: (num) => this.subject.next(num),
      onError: (error) => {
        console.log(error)
        this.subject.error(error);
      }
    });
  }
}

export { BlockCollector };
