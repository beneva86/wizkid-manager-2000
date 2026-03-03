import { Injectable, Logger } from '@nestjs/common';
import { EmailPayloadMap, EmailTemplate } from './email.types';
import { renderEmail } from './email.templates';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendTemplate<T extends EmailTemplate>(
    to: string,
    template: T,
    payload: EmailPayloadMap[T],
  ): Promise<void> {
    const { subject, bodyText } = renderEmail(template, payload);

    // Simulate sending an email by logging the details
    this.logger.log(
      [
        'Sending email (simulated)',
        `To: ${to}`,
        `Subject: ${subject}`,
        `Body:\n${bodyText}`,
      ].join('\n'),
    );

    // In real life this would call an email provider
  }
}
