---
title: Usend - A free alternative for sending emails in Node.js
titleTemplate: ':title'
head:
  - [
      'meta',
      {
        property: 'og:description',
        content: 'Usend is a free alternative for sending emails in Node.js',
      },
    ]
---

<script setup>
import { isValidDomain, isValidEmail } from "./utils/validate.js";
import { useStorage } from '@vueuse/core'

const domain = useStorage('domain', null);
</script>

# Usend

Usend is a powerful tool for sending emails for free. It provides a clean and easy approach to sending emails with various options in Node.js.

```ts-vue
import { Usend } from "usend-email";

const usend = new Usend();

(async () => {
  await usend.sendEmail({
    from: "sender@{{ domain || "example.com" }}",
    to: "recipient@example.com",
    subject: "Hello from Usend",
    html: "<h1>It works!</h1>",
  });
})();
```

## Features

- **Easy integration** 🔌 - Seamlessly integrate with either a default vendor email sending API or easily customize it to fit your needs.
- **Multiple Content Types** 📄 - Support sending emails with text, HTML, or React content.
- **Validation with Zod** 💎 - Validate email options using Zod and TypeScript.
- **Flexible Recipient Handling** 💌 - Handle multiple recipients, carbon copy (CC), blind carbon copy (BCC), and reply-to addresses.
- **Enhanced Email Security** 🔒 - Optional DKIM (DomainKeys Identified Mail) support for enhanced email security.

## Use Cases

Here are a few examples of how you can utilize Usend:

1. **Sending Transactional Emails**: Use Usend to send transactional emails, such as order confirmations, password reset instructions, or account notifications.

2. **Notification System**: Implement a robust notification system by integrating Usend into your application, enabling you to send important updates or alerts to your users.

3. **Email Marketing Campaigns**: Utilize Usend's features to create and manage email marketing campaigns, delivering engaging content and promotional offers to your subscribers.

4. **Automated Reminders**: Set up automated reminders or scheduled emails using Usend, ensuring timely delivery of reminders, event notifications, or follow-up messages.

5. **Personalized Communications**: Leverage Usend to send personalized emails to your users, dynamically generating content based on user preferences, actions, or specific events.

These are just a few examples of how Usend can be utilized to enhance your email sending capabilities and streamline your communication processes.
