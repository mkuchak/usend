export type UsendOptions = {
  vendorUrl?: string;
  vendorApiKey?: string;
  dkimPrivateKey?: string;
};

// prettier-ignore
export type EmailContact = string | {
  email?: string;
  name?: string;
};

// prettier-ignore
export type AttachmentFile = string | {
  path: string;
  name?: string;
};

// prettier-ignore
export type ListUnsubscribe = string | {
  email?: string;
  url?: string;
};

// prettier-ignore
export type SendEmailOptions = {
  from: EmailContact;
  to: EmailContact | EmailContact[];
  bcc?: EmailContact | EmailContact[];
  cc?: EmailContact | EmailContact[];
  replyTo?: EmailContact;
  subject: string;
  /**
   * **Note**: Currently, this field only allows the attachment of texts due to
   * the limitation of the "Content-Transfer-Encoding: quoted-printable" header
   * defined by MailChannels. Maybe in the future Base64 encoding will be supported.
   */
  attachments?: AttachmentFile | AttachmentFile[];
  unsubscribe?: ListUnsubscribe;
  text?: string;
  html?: string;
  react?: React.ReactNode;
} & (
  | { text: string }
  | { html: string }
  | { react: React.ReactNode }
);

export type SendEmailResponse = {
  status: number;
  data: any;
};

export type MailSendBody = {
  headers?: {
    [key: string]: string;
  };
  from: {
    email: string;
    name?: string;
  };
  subject: string;
  content: {
    type: string;
    value: string;
  }[];
  personalizations: {
    to: {
      email: string;
      name?: string;
    }[];
    cc?: {
      email?: string;
      name?: string;
    }[];
    bcc?: {
      email?: string;
      name?: string;
    }[];
    reply_to?: {
      email: string;
      name?: string;
    };
    dkim_domain?: string;
    dkim_selector?: string;
    dkim_private_key?: string;
  }[];
};
