export type UsendOptions = {
  vendorUrl?: string;
  vendorApiKey?: string;
  domain?: string;
  dkimPrivateKey?: string;
};

// prettier-ignore
export type EmailContact = string | {
  email?: string;
  name?: string;
};

// prettier-ignore
export type SendEmailOptions = {
  from: EmailContact;
  to: EmailContact | EmailContact[];
  bcc?: EmailContact[];
  cc?: EmailContact[];
  replyTo?: EmailContact[];
  subject: string;
  text?: string;
  html?: string;
  react?: React.ReactNode;
} & (
  | { text: string }
  | { html: string }
  | { react: React.ReactNode }
);
