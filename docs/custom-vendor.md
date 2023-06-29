---
outline: deep
---

<script setup>
import { nanoid } from "nanoid";
import { ref, onMounted } from "vue";
import { useStorage } from '@vueuse/core'
import { copy, showButton } from "./utils/clipboard.js";

const domain = useStorage('domain', null);
const apiKey = ref(null);

const generateApiKey = () => {
  apiKey.value = nanoid(2048);
};

onMounted(async () => await generateApiKey());
</script>

# Custom Vendor

Usend is built upon a default vendor implementation, but it also provides the flexibility to customize and create your own vendor. This allows you to tailor the email sending functionality to meet your specific requirements. To create a custom vendor, follow these steps:

## Steps to create a custom vendor

### 1. Clone the Usend repository

Be sure to have [Git installed](https://git-scm.com/) on your system. Then, clone the Usend repository using the following command:

```bash
git clone https://github.com/mkuchak/usend.git
```

### 2. Go to the vendor directory and install dependencies

Go to the `vendor` directory in the Usend repository and install the dependencies using the following command:

```bash
cd usend/vendor && npm install
```

### 3. Copy environment variables file and replace it

Now, inside the `vendor` directory, copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

And replace the `USEND_VENDOR_API_KEY` values with your own credential.

<button class="custom-button" @click="generateApiKey">&#x21bb; Generate key again</button>

```.env-vue
USEND_VENDOR_API_KEY={{ apiKey }}
```

### 4. Deploy your custom vendor on Cloudflare Workers

To deploy your custom vendor on Cloudflare Workers, you need to have a [Cloudflare account](https://dash.cloudflare.com/sign-up). Then, you can deploy your custom vendor using the following command:

```bash
npm run deploy
```

The command will prompt you to log in to Cloudflare to authenticate your account. Once executed successfully, it will output the URL of **your custom vendor**. You can use this URL to configure your Usend application.

```bash
Uploaded usend-vendor (1.92 sec)
Published usend-vendor (4.08 sec)
  https://usend-vendor.xxxxx.workers.dev
Current Deployment ID: yyyyyyyyyyyyyyyyyyyyyyyyyyy
```

### 5. Update the Domain Lockdown™ TXT record

Update the Domain Lockdown™ TXT record in your DNS settings provider with the following details:

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
          <button @click="copy(`v=mc1 cfid=xxxxx.workers.dev`)" class="custom-clipboard"></button>
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
        v=mc1 cfid=xxxxx.workers.dev
      </td>
    </tr>
  </tbody>
</table>

Don't forget to replace `example.com` with your domain name and the value `xxxxx` with your own Cloudflare ID.

### 6. Configure your application

To configure your application to use your custom vendor, you need to update the `vendor` configuration setting in Usend constructor. Before doing so, make sure that the `USEND_VENDOR_URL` and `USEND_VENDOR_API_KEY` variables are up-to-date in your `.env` file. You can accomplish this by adding the following code to your Usend application:

```ts-vue{4,5}
import { Usend } from "usend-email";

const usend = new Usend({
  vendorUrl: process.env.USEND_VENDOR_URL, // or "https://usend-vendor.xxxxx.workers.dev"
  vendorApiKey: process.env.USEND_VENDOR_API_KEY, // or "{{ apiKey?.slice(0, 20) }}..."
});

(async () => {
  await usend.sendEmail({
    from: "sender@{{ domain || "example.com" }}",
    to: "recipient@example.com",
    subject: "Hello from Usend",
    html: "<h1>It works!</h1>",
  });
})();
```

## Enjoy it! :tada:

By leveraging the capability to create a custom vendor, you have the freedom to tailor Usend according to your unique requirements and integrate it seamlessly into your existing email infrastructure. Enjoy the flexibility and power of Usend's custom vendor functionality.
