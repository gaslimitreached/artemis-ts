import { AbiEvent } from 'abitype';
import { Subject } from 'rxjs';
import { Address, Log, PublicClient } from 'viem';

type EventScope = {
  address?: Address | Address[],
  event?: AbiEvent,
  // https://viem.sh/docs/actions/public/watchEvent.html#arguments
  args?: any,
}

class LogCollector {
  private client: PublicClient; 
  private filter: EventScope;
  private subject: Subject<any>;

  constructor(
    client: PublicClient,
    filter: EventScope,
    subject: Subject<Log[]>
  ) {
    this.client = client;
    this.filter = filter;
    this.subject = subject;
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

