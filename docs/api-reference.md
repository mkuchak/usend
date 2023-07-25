---
outline: deep
---

# API Reference

The API Reference section provides comprehensive information about the classes and functions exported by the `Usend` library. These resources allows you to send emails easily using various options in Node.js.

## Class: Usend

The `Usend` class is the main class of the library. It provides methods for sending emails.

## Constructor

### new Usend(options?: UsendOptions)

Creates an instance of the `Usend` class.

- `options` (optional): An object that can contain the following optional properties:
  - `vendorUrl` (string): The URL of the vendor's API. If not specified, the default vendor's URL will be used.
  - `vendorApiKey` (string): The API key for the vendor's API. If not specified, the default vendor's API key will be used.
  - `dkimPrivateKey` (string): The private key for DKIM signing. If not specified, DKIM signing will be disabled.

Throws an error if the `vendorUrl` is invalid or if the `vendorUrl` is provided without the `vendorApiKey`.

## Methods

### sendEmail(options: SendEmailOptions): Promise<void\>

Sends an email with the specified options.

- `options`: An object containing the following properties:
  - `from`: The sender of the email. It can be a string representing an email address or an object with `email` and `name` properties.
  - `to`: The recipient(s) of the email. It can be a string representing an email address, an object with `email` and `name` properties, or an array of such objects.
  - `bcc` (optional): The blind carbon copy recipient(s) of the email. It can be a string representing an email address, an object with `email` and `name` properties, or an array of such objects.
  - `cc` (optional): The carbon copy recipient(s) of the email. It can be a string representing an email address, an object with `email` and `name` properties, or an array of such objects.
  - `replyTo` (optional): The email address to which replies should be sent. It can be a string representing an email address, an object with `email` and `name` properties.
  - `subject`: The subject of the email.
  - `attachments` (optional): An attachment file or an array of attachment files to be sent with the email.
  - `unsubscribe` (optional): The unsubscribe information for the email.
  - `text` (optional): The plain text content of the email.
  - `html` (optional): The HTML content of the email.
  - `react` (optional): The React component to be rendered as the email content.

Returns a Promise that resolves when the email is sent successfully. Throws an error if the `options` object is invalid or if at least one of `text`, `html`, or `react` properties is not specified.

## Helper Functions

The following helper functions are also provided by the Usend library.

### replaceHtml(template: string, dictionary: { [key: string]: string | number }): string

Replaces placeholders in an HTML template with the corresponding values from a dictionary.

- `template`: The HTML template string with placeholders to be replaced.
- `dictionary`: An object containing key-value pairs where the keys are the placeholders in the template and the values are the replacements.

```ts
const template = "<h1>Hello, {name}!</h1>";
const dictionary = { "{name}": "John" };
const html = replaceHtml(template, dictionary);

console.log(html); // Output: <h1>Hello, John!</h1>
```

Returns the modified HTML string with the placeholders replaced.

## Types

The following types are used in the Usend library.

### UsendOptions

An object that represents the options for configuring the `Usend` class.

```ts
{
  vendorUrl?: string;
  vendorApiKey?: string;
  dkimPrivateKey?: string;
}
```

- `vendorUrl` (optional): The URL of the vendor's API.
- `vendorApiKey` (optional): The API key for the vendor's API.
- `dkimPrivateKey` (optional): The private key for DKIM signing.

### EmailContact

A string or an object representing an email contact.

```ts
type EmailContact = string | {
  email?: string;
  name?: string;
};
```

- If `EmailContact` is a string, it represents an email address.
- If `EmailContact` is an object, it can have `email` and `name` properties representing the email address and the name of the contact, respectively.

### AttachmentFile

A string or an object representing an attachment file.

```ts
type AttachmentFile = string | {
  path: string;
  name?: string;
};
```

- If `AttachmentFile` is a string, it represents the file path.
- If `AttachmentFile` is an object, it can have a `path` property representing the file path, and an optional `name` property representing the desired filename for the attachment.

**Note**: Currently, this field only allows the attachment of texts due to the limitation of the `Content-Transfer-Encoding: quoted-printable` header defined by MailChannels. Maybe in the future Base64 encoding will be supported.

### ListUnsubscribe

A string or an object representing the unsubscribe information for the email.

```ts
type ListUnsubscribe = string | {
  email?: string;
  url?: string;
};
```

- If `ListUnsubscribe` is a string, it represents a URL for unsubscribing.
- If `ListUnsubscribe` is an object, it can have `email` and/or `url` properties representing the email address and/or the URL for unsubscribing, respectively.

### SendEmailOptions

An object that represents the options for sending an email.

```ts
type SendEmailOptions = {
  from: EmailContact;
  to: EmailContact | EmailContact[];
  bcc?: EmailContact | EmailContact[];
  cc?: EmailContact | EmailContact[];
  replyTo?: EmailContact;
  subject: string;
  attachments?: AttachmentFile | AttachmentFile[];
  unsubscribe?: ListUnsubscribe;
} & (
  | { text: string }
  | { html: string }
  | { react: React.ReactNode }
);
```

- `from`: The sender of the email.
- `to`: The recipient(s) of the email.
- `bcc` (optional): The blind carbon copy recipient(s) of the email.
- `cc` (optional): The carbon copy recipient(s) of the email.
- `replyTo` (optional): The email address(es) to which replies should be sent.
- `subject`: The subject of the email.
- `attachments` (optional): An attachment file or an array of attachment files to be sent with the email.
- `unsubscribe` (optional): The unsubscribe information for the email.
- `text` (optional): The plain text content of the email.
- `html` (optional): The HTML content of the email.
- `react` (optional): The React component to be rendered as the email content.

### SendEmailResponse

An object representing the response after sending an email.

```ts
type SendEmailResponse = {
  status: number;
  data: any;
};
```

- `status`: The status code of the response.
- `data`: Additional data returned after sending the email.
