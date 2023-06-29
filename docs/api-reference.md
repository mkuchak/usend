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
  - `domain` (string): The domain to be used for DKIM signing. If not specified, the domain of the sender's email address will be used.
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
  - `replyTo` (optional): The email address(es) to which replies should be sent. It can be a string representing an email address, an object with `email` and `name` properties, or an array of such objects.
  - `subject`: The subject of the email.
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
  domain?: string;
  dkimPrivateKey?: string;
}
```

- `vendorUrl` (optional): The URL of the vendor's API.
- `vendorApiKey` (optional): The API key for the vendor's API.
- `domain` (optional): The domain to be used for DKIM signing.
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

### SendEmailOptions

An object that represents the options for sending an email.

```ts
type SendEmailOptions = {
  from: EmailContact;
  to: EmailContact | EmailContact[];
  bcc?: EmailContact[];
  cc?: EmailContact[];
  replyTo?: EmailContact[];
  subject: string;
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
- `text` (optional): The plain text content of the email.
- `html` (optional): The HTML content of the email.
- `react` (optional): The React component to be rendered as the email content.
