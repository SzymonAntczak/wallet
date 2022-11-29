import { Publisher, Subjects, WalletCreatedEvent } from '@sawallet/common';

export class WalletCreatedPublisher extends Publisher<WalletCreatedEvent> {
  readonly subject = Subjects.WalletCreated;
}
