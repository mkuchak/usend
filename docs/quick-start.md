---
outline: deep
---

<script setup>
import { useStorage } from "@vueuse/core";
import { isValidDomain, isValidEmail } from "./utils/validate.js";
import { copy, showButton } from "./utils/clipboard.js";

const domain = useStorage("domain", null);
const email = useStorage("email", null);
</script>

# Getting Started

Using Usend to send emails is super easy. You can quickly set up your project, write a piece of code, and deploy it seamlessly. Let's take a look at the basic usage of Usend.

## Starting in a Few Steps

By providing your domain and administrative email, you can proceed with the setup and configuration specific to your domain for an optimal Usend experience.

<div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 16px;">
  <input :class="['custom-input', !isValidDomain(domain) && 'wrong']" v-model="domain" type="text" placeholder="example.com" />
  <input :class="['custom-input', !isValidEmail(email) && 'wrong']" v-model="email" type="email" placeholder="admin@example.com" />
</div>

### 1. Install

Usend is available as an npm package. You can install it using the following command:

```bash
npm install usend
```

With this simple setup, you'll be ready to start utilizing Usend for sending emails in no time.

### 2. Add SPF record

To start sending emails, it's essential to have your own domain. To verify domain ownership and authorize **MailChannels** (find out more about MailChannels [here](/supporters.html)) to send emails on your behalf, you need to add an SPF (Sender Policy Framework) record to your DNS settings. This record ensures that your domain is legitimate and allows for secure and authorized email transmission.

To accomplish this, access your DNS provider and add a TXT record with the following details:

<table>
  <thead>
    <tr>
      <th @mouseover="showButton(0)" @mouseout="showButton(-1)">
        <div class="flex">
          Name
          <button @click="copy(`${ domain || 'example.com' }`)" class="custom-clipboard"></button>
        </div>
      </th>
      <th @mouseover="showButton(1)" @mouseout="showButton(-1)">
        <div class="flex">
          Type
          <button @click="copy(`TXT`)" class="custom-clipboard"></button>
        </div>
      </th>
      <th @mouseover="showButton(2)" @mouseout="showButton(-1)">
        <div class="flex">
          Content
          <button @click="copy(`v=spf1 a mx include:relay.mailchannels.net ~all`)" class="custom-clipboard"></button>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td @mouseover="showButton(0)" @mouseout="showButton(-1)">
        {{ domain || "example.com" }}
      </td>
      <td @mouseover="showButton(1)" @mouseout="showButton(-1)">
        TXT
      </td>
      <td @mouseover="showButton(2)" @mouseout="showButton(-1)">
        v=spf1 a mx include:relay.mailchannels.net ~all
      </td>
    </tr>
  </tbody>
</table>

And just replace `example.com` with your actual domain name.

### 3. Setup Domain Lockdown™

To prevent unauthorized users and accounts from sending emails from your domain without your permission, you need to use [Domain Lockdown™](https://support.mailchannels.com/hc/en-us/articles/16918954360845-Secure-your-domain-name-against-spoofing-with-Domain-Lockdown-). To do this, add a TXT record with the following details:

<table>
  <thead>
    <tr>
      <th @mouseover="showButton(0)" @mouseout="showButton(-1)">
        <div class="flex">
          Name
          <button @click="copy(`_mailchannels.${ domain || 'example.com' }`)" class="custom-clipboard"></button>
        </div>
      </th>
      <th @mouseover="showButton(1)" @mouseout="showButton(-1)">
        <div class="flex">
          Type
          <button @click="copy(`TXT`)" class="custom-clipboard"></button>
        </div>
      </th>
      <th @mouseover="showButton(2)" @mouseout="showButton(-1)">
        <div class="flex">
          Content
          <button @click="copy(`v=mc1 cfid=usend.email`)" class="custom-clipboard"></button>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td @mouseover="showButton(0)" @mouseout="showButton(-1)">
        _mailchannels.{{ domain || "example.com" }}
      </td>
      <td @mouseover="showButton(1)" @mouseout="showButton(-1)">
        TXT
      </td>
      <td @mouseover="showButton(2)" @mouseout="showButton(-1)">
        v=mc1 cfid=usend.email
      </td>
    </tr>
  </tbody>
</table>

By adding this DNS TXT record, you indicate a list of permitted senders and accounts that are allowed to send emails from your domain. Any other accounts attempting to send from your domain will have their emails rejected with an error. This provides an additional layer of security and control over email sending from your domain.

### 4. Send email using HTML

With Usend, you can easily send emails with HTML content, allowing you to create visually appealing and dynamic email messages. To send an email with HTML content, follow these steps:

1. Construct your email message using HTML markup, including formatting, styles, images, and links.

2. In your Usend code, specify the HTML content of the email using the `html` parameter when calling the `sendEmail` method.

   ```ts-vue
   await usend.sendEmail({
     from: "sender@{{ domain || "example.com" }}",
     to: "recipient@example.com",
     subject: "Hello from Usend",
     html: "<h1>Welcome to Usend</h1><p>This is a sample email sent using Usend.</p>",
   });
   ```

   Customize the `from`, `to`, `subject`, and `html` values as per your requirements.

3. Execute your code, and Usend will handle the process of sending the email with the specified HTML content.

By incorporating HTML into your emails, you can create visually rich and engaging content to make your messages more impactful and effective. You also can [utilize React](https://github.com/mkuchak/usend/blob/main/lib/example/index.ts) to create dynamic email content.

## Improve Your Domain Security (Recommended)

While you can already start sending emails with Usend, we recommend taking more steps to protect your domain from unauthorized usage. This ensures that your domain remains secure and prevents anyone from impersonating you and sending emails on your behalf. To learn how to implement additional safeguards for your domain in just a few simple steps, refer to the [documentation](/domain-protection.html). Safeguarding your domain will provide an extra layer of security and peace of mind.
