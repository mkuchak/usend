type UsendOptions = {
  vendorUrl?: string;
  vendorApiKey?: string;
  dkimPrivateKey?: string;
};

// prettier-ignore
type EmailContact = string | {
  email?: string;
  name?: string;
};

// prettier-ignore
type SendEmailOptions = {
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
