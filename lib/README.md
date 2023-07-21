# Usend

Usend is a powerful tool for **sending emails for free**. It provides a clean and easy approach to sending emails with various options in Node.js. Check the complete [documentation](https://usend.email) for more details.

## Features

- **Easy integration** 🔌 - Seamlessly integrate with either a default vendor email sending API or easily customize it to fit your needs.
- **Multiple Content Types** 📄 - Support sending emails with text, HTML, or React content.
- **Validation with Zod** 💎 - Validate email options using Zod and TypeScript.
- **Flexible Recipient Handling** 💌 - Handle multiple recipients, carbon copy (CC), blind carbon copy (BCC), and reply-to addresses.
- **Enhanced Email Security** 🔒 - Optional DKIM (DomainKeys Identified Mail) support for enhanced email security.

## Installation

To install Usend, run the following command:

```bash
npm install usend-email
# or
yarn add usend-email
```

## Setup

### Add SPF record

To start sending emails, it's essential to have your own domain. With your domain active at a domain registrar, access your DNS provider and add the following TXT record:

| Name        | Type | Content                                         |
| ----------- | ---- | ----------------------------------------------- |
| example.com | TXT  | v=spf1 a mx include:relay.mailchannels.net ~all |

And just replace `example.com` with your actual domain name.

### Add Domain Lockdown™ record

To authorize Usend to send emails on behalf of your domain, you need to use [Domain Lockdown™](https://support.mailchannels.com/hc/en-us/articles/16918954360845-Secure-your-domain-name-against-spoofing-with-Domain-Lockdown-). To do this, add a TXT record with the following details:

| Name                      | Type | Content                |
| ------------------------- | ---- | ---------------------- |
| _mailchannels.example.com | TXT  | v=mc1 cfid=usend.email |

Again, replace `example.com` with your actual domain name.

## Usage

Now, you're ready to start sending emails with Usend. First, import `Usend` class from `usend-email` package and initialize it:

```ts
import { Usend } from 'usend-email';

const usend = new Usend();
```

### Send email using plain text and HTML

```ts
await usend.sendEmail({
  from: 'sender@example.com',
  to: 'recipient@example.com',
  subject: 'Hello from Usend',
  text: 'This is the plain text content of the email.',
  html: '<p>This is the HTML content of the email.</p>',
});
```

### Send email using React

Create a React component that returns the email content:

```tsx
import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div>
    <h1>This is your first message, {firstName}!</h1>
  </div>
);
```

Then, send the email importing the component and passing the props:

```ts
import { EmailTemplate } from './EmailTemplate';

await usend.sendEmail({
  from: 'sender@example.com',
  to: 'recipient@example.com',
  subject: 'Hello from Usend',
  react: EmailTemplate({ firstName: "John" }), // or in .tsx <EmailTemplate firstName="John" />
});
```

Finally, check the email in your inbox and enjoy! 🎉

## Protect your Domain

To prevent unauthorized third parties from sending emails from your domain without your permission, you can use RSA encryption based on the DKIM (DomainKeys Identified Mail) protocol. The standard implementation of Usend will search for a DKIM public key in your domain, and if the record exists, it will only send your email when you provide the private key during the sending process. For instructions on how to configure this option, refer to the [documentation](https://usend.email/domain-protection.html).

## Supporters

Usend is powered by the infrastructure of **Cloudflare** and **MailChannels**, enabling seamless and efficient email communication. This simple, yet powerful email sending library benefits from the robust infrastructure and reliable delivery services provided by these companies.

The partnership between Cloudflare and MailChannels has made Usend a valuable tool for developers. To learn more about how they contribute to the project's infrastructure, we recommend reading the blog post [Sending Email from Workers with MailChannels](https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/).

## License
Usend is licensed under the [MIT License](https://opensource.org/licenses/MIT).
