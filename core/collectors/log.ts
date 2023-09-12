import { Subject } from 'rxjs';
import { AbiEvent } from 'abitype';
import {
  Address,
  Chain,
  createPublicClient,
  Log,
  PublicClient,
  webSocket,
} from 'viem';

type EventScope = {
  address?: Address | Address[],
  event?: AbiEvent,
  // https://viem.sh/docs/actions/public/watchEvent.html#arguments
  args?: any,
}

class LogCollector {
  private client: PublicClient; 
  private filter: EventScope;
  private subject: Subject<Log[]>;

  constructor(
    url: string,
    chain: Chain,
    filter: EventScope,
    subject: Subject<Log[]>
  ) {
    this.subject = subject;
    this.filter = filter;

    this.client = createPublicClient({
      batch: { multicall: true },
      chain: chain,
      transport: webSocket(url),
    });
  }

  public start() {
    try {
      this.client
        .watchEvent({
          ...this.filter,
          onLogs: (logs) => this.subject.next(logs),
        });
    } catch (error) {
      this.subject.error(error);
    }
  }
}

export { LogCollector, EventScope };

