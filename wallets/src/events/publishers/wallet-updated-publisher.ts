import { Publisher, Subjects, WalletUpdatedEvent } from '@sawallet/common';

export class WalletUpdatedPublisher extends Publisher<WalletUpdatedEvent> {
  readonly subject = Subjects.WalletUpdated;
}
