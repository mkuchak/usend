---
outline: deep
---

<script setup>
import { nanoid } from "nanoid";
import { useStorage } from '@vueuse/core'
import { ref, onMounted } from "vue";
import { isValidDomain, isValidEmail } from "./utils/validate.js";
import { copy, showButton } from "./utils/clipboard.js";

const id = nanoid(8);
const domain = useStorage('domain', null);
const email = useStorage('email', null);
const exportedKeyPair = ref(null);

const generateKeys = async () => {
  const { generateRSAKeyPair, exportKey } = await import("./utils/rsa.js");
  const rsaKeyPair = await generateRSAKeyPair();
  exportedKeyPair.value = {
    publicKey: await exportKey(rsaKeyPair.publicKey, "public"),
    privateKey: await exportKey(rsaKeyPair.privateKey, "private"),
  };
};

onMounted(async () => await generateKeys());
</script>

# Domain Protection

To protect your domain from unauthorized third-party email spoofing, a combination of security measures are utilized, including SPF (Sender Policy Framework), Domain Lockdown™, DKIM (DomainKeys Identified Mail), and DMARC (Domain-based Message Authentication, Reporting, and Conformance) records. DKIM allows senders to digitally sign emails, ensuring that the content remains unaltered during transit. DMARC further enhances email security by providing a policy framework for authentication, reporting, and conformance, building upon the foundation laid by DKIM and SPF (Sender Policy Framework). These measures work together to fortify your domain against email fraud and maintain the integrity of your email communications.

::: warning
This is an optional but **strongly recommended** step. If you want to improve your domain protection, follow these steps.
:::


## Setting Up DMARC and DKIM Records

### Prerequisites

Before starting these steps, you need to have already installed the SPF record and Domain Lockdown™. For instructions on how to set it up, please refer to [this link](/quick-start.html#_2-add-spf-record). For assistance in completing, fill in the fields with your domain and administrative email:

<div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 16px;">
  <input :class="['custom-input', !isValidDomain(domain) && 'wrong']" v-model="domain" type="text" placeholder="example.com" />
  <input :class="['custom-input', !isValidEmail(email) && 'wrong']" v-model="email" type="email" placeholder="admin@example.com" />
</div>

----

### 1. Add DMARC record

DMARC mandates an administrative email for receiving reports and notifications, enabling monitoring, issue resolution, and control over email deliverability and brand reputation.

To add a DMARC record, access your DNS provider and add a TXT record with the following details:

<table>
  <thead>
    <tr>
      <th @mouseover="showButton(0)" @mouseout="showButton(-1)">
        <div class="flex">
          Name
          <button @click="copy(`_dmarc`)" class="custom-clipboard"></button>
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
          <button @click="copy(`v=DMARC1;p=reject;adkim=s;aspf=s;rua=mailto:${ email || 'admin@example.com' };ruf=mailto:${ email || 'admin@example.com' };pct=100;fo=1;`)" class="custom-clipboard"></button>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td @mouseover="showButton(0)" @mouseout="showButton(-1)">
        _dmarc
      </td>
      <td @mouseover="showButton(1)" @mouseout="showButton(-1)">
        TXT
      </td>
      <td @mouseover="showButton(2)" @mouseout="showButton(-1)">
        v=DMARC1;p=reject;adkim=s;aspf=s;rua=mailto:{{ email || "admin@example.com" }};ruf=mailto:{{ email || "admin@example.com" }};pct=100;fo=1;
      </td>
    </tr>
  </tbody>
</table>

Update the `admin@example.com` email address with your own administrative email address.

### 2. Generate and add DKIM public key record

To implement DKIM authentication, you need to generate a DKIM private key and add it as a TXT record in your DNS settings. We have generated a public and private key pair for you, but if you prefer, you can also generate them using [OpenSSL command](/domain-protection.html#using-openssl-to-generate-keys-optional):

<button class="custom-button" @click="generateKeys">&#x21bb; Generate keys again</button>

<table>
  <thead>
    <tr>
      <th @mouseover="showButton(0)" @mouseout="showButton(-1)">
        <div class="flex">
          Name
          <button @click="copy(`mailchannels._domainkey`)" class="custom-clipboard"></button>
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
          <button @click="copy(`v=DKIM1;p=${ exportedKeyPair?.publicKey }`)" class="custom-clipboard"></button>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td @mouseover="showButton(0)" @mouseout="showButton(-1)">
        mailchannels._domainkey
      </td>
      <td @mouseover="showButton(1)" @mouseout="showButton(-1)">
        TXT
      </td>
      <td @mouseover="showButton(2)" @mouseout="showButton(-1)">
        v=DKIM1;p={{ exportedKeyPair?.publicKey }}
      </td>
    </tr>
  </tbody>
</table>

### 3. Add DKIM private key to your project environment

Now, to send emails through your domain using Usend, you need to use the DKIM private key. For this, you can add it to your `.env` environment variables file.

```.env-vue
DKIM_PRIVATE_KEY={{ exportedKeyPair?.privateKey }}
```

### 4. And start sending secure emails with Usend

With these simple steps, you can now start sending secure emails with Usend. 

```ts-vue{3}
import { Usend } from "usend-email";

const usend = new Usend({ dkimPrivateKey: process.env.DKIM_PRIVATE_KEY });
// or
// const usend = new Usend({ dkimPrivateKey: "{{ exportedKeyPair?.privateKey.slice(0, 25) }}..." });

(async () => {
  await usend.sendEmail({
    from: "noreply@{{ domain || "example.com" }}",
    to: "{{ id }}@mailsac.com",
    subject: "Hello from Usend",
    html: "<h1>It works!</h1>",
  });
})();
```

### 5. Done, now just confirm! :tada:

Confirm the sending of the email at <a :href="'https://mailsac.com/inbox/' + id + '@mailsac.com'" target="_blank">https://mailsac.com/inbox/{{ id }}@mailsac.com</a>.

## Using OpenSSL to Generate Keys (Optional)

::: info
If you prefer, you can generate the DKIM key pair using OpenSSL. For your convenience, you can use the keys we generated for you and skip these steps.
:::

### 1. Generate a private key

Generate a private key (`.pem` and `.txt` file):

```bash
openssl genrsa 2048 | tee priv_key.pem | openssl rsa -outform der | openssl base64 -A > priv_key.txt
```

Now, open the `priv_key.txt` file, copy and place the contents in the `.env` file as the `DKIM_PRIVATE_KEY` variable.

### 2. Generate a public key

Generate a public key (`.txt` file):

```bash
echo -n "v=DKIM1;p=" > pub_key_record.txt && \
openssl rsa -in priv_key.pem -pubout -outform der | openssl base64 -A >> pub_key_record.txt
```

Add the contents of the `pub_key_record.txt` file as a TXT record on your DNS provider.
