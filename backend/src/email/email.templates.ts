import { EmailTemplate, EmailPayloadMap, RenderedEmail } from './email.types';

export function renderEmail<T extends EmailTemplate>(
  template: T,
  payload: EmailPayloadMap[T],
): RenderedEmail {
  switch (template) {
    case EmailTemplate.FIRED: {
      const { name } = payload;
      return {
        subject: 'Your wizard powers have been paused',
        bodyText: [
          `Hey ${name},`,
          '',
          'Your Wizkid Manager access has been turned off.',
          '',
          'If you think this was unexpected, reach out to your boss.',
          '',
          'May the code be with you.',
        ].join('\n'),
      };
    }

    case EmailTemplate.UNFIRED: {
      const { name } = payload;
      return {
        subject: "You're back in the game",
        bodyText: [
          `Hey ${name},`,
          '',
          "Good news — you're officially reinstated!",
          '',
          'Your access to Wizkid Manager is restored.',
          'Go build cool stuff.',
          '',
          'Welcome back',
        ].join('\n'),
      };
    }

    default: {
      // Exhaustive check: if we added a new template but forgot to handle it here, this will cause a compile error
      const exhaustive: never = template;
      throw new Error(`Unknown email template: ${exhaustive}`);
    }
  }
}
