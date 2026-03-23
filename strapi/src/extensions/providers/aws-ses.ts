import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

interface SESProviderConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  defaultFrom?: string;
  defaultReplyTo?: string;
}

interface EmailProvider {
  send: (options: {
    to: string | string[];
    from?: string;
    replyTo?: string;
    subject: string;
    text?: string;
    html?: string;
  }) => Promise<void>;

  sendTemplated?: (...args: any[]) => Promise<void>;
}

const provider = {
  init(
    { region, accessKeyId, secretAccessKey }: SESProviderConfig,
    { defaultFrom, defaultReplyTo }: { defaultFrom?: string; defaultReplyTo?: string }
  ): EmailProvider {
    const client = new SESClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    return {
      async send(options) {
        const {
          to,
          from = defaultFrom,
          replyTo = defaultReplyTo,
          subject,
          text,
          html,
        } = options;

        const command = new SendEmailCommand({
          Source: from!,
          Destination: {
            ToAddresses: Array.isArray(to) ? to : [to],
          },
          Message: {
            Subject: { Data: subject },
            Body: {
              ...(text ? { Text: { Data: text } } : {}),
              ...(html ? { Html: { Data: html } } : {}),
            },
          },
          ...(replyTo ? { ReplyToAddresses: [replyTo] } : {}),
        });

        try {
          const result = await client.send(command);
          strapi.log.info(`[email] Email sent: ${result.MessageId}`);
        } catch (error) {
          strapi.log.error(`[email] Email send failed: ${error}`);
          throw error;
        }
      },

      async sendTemplated() {
        throw new Error('sendTemplated is not implemented.');
      },
    };
  },
};

// 👇 This is the fix
export = provider;
