import { Subject } from 'rxjs';
import { PublicClient } from 'viem';

class BlockCollector {
  private client: PublicClient; 
  private subject: Subject<BigInt>;

  constructor(client: PublicClient, subject: Subject<BigInt>) {
    this.subject = subject;
    this.client = client;
  }

  public start() {
    return this.client.watchBlockNumber({
      onBlockNumber: (num) => this.subject.next(num),
      onError: (error) => this.subject.error(error),
    });
  }
}

export { BlockCollector };

