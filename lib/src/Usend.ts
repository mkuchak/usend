import axios, { AxiosInstance } from "axios";
import { readFileSync } from "fs";
import mime from "mime/lite";
import * as React from "react";
import ReactDOMServer from "react-dom/server";
import { ZodError } from "zod";
import { version } from "../package.json";
import { AttachmentFile, EmailContact, SendEmailOptions, SendEmailResponse, UsendOptions } from "./usend";
import { sendEmailOptionsSchema } from "./utils/schema";

export class Usend {
  private api: AxiosInstance;
  private vendorUrl: string;
  private vendorApiKey: string;
  private dkimPrivateKey?: string;

  constructor(options?: UsendOptions) {
    if (options?.vendorUrl && !this.isValidUrl(options.vendorUrl)) {
      throw new Error("Invalid Vendor URL");
    }
    if (options?.vendorUrl && !options.vendorApiKey) {
      throw new Error("Vendor API Key is required");
    }

    this.vendorUrl = options?.vendorUrl || process.env.USEND_VENDOR_URL;
    this.vendorApiKey = options?.vendorApiKey || process.env.USEND_VENDOR_API_KEY;
    this.dkimPrivateKey = options?.dkimPrivateKey;

    this.api = axios.create({
      baseURL: this.vendorUrl,
      headers: {
        Authorization: `Bearer ${this.vendorApiKey}`,
        "User-Agent": `usend/${version}`,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    this.api.interceptors.response.use(
      (response) => {
        return response.data || response;
      },
      (error) => {
        const errorData = error?.response?.data;
        if (errorData?.error) {
          return Promise.reject(errorData.error);
        }
        return Promise.reject(errorData || error);
      }
    );
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private processRecipients(options: SendEmailOptions) {
    const processRecipientsArray = (recipient?: EmailContact | EmailContact[]) => {
      if (!recipient) {
        return undefined;
      }

      if (Array.isArray(recipient)) {
        return recipient.map((r) => this.extractContact(r));
      }

      return [this.extractContact(recipient)];
    };

    const to = processRecipientsArray(options.to);
    const bcc = processRecipientsArray(options.bcc);
    const cc = processRecipientsArray(options.cc);

    return { to, bcc, cc, replyTo: this.extractContact(options.replyTo), from: this.extractContact(options.from) };
  }

  private extractDomain(from: EmailContact) {
    if (typeof from === "string") {
      return from.split("@")[1];
    }
    return from?.email?.split("@")[1];
  }

  private extractContact(from: EmailContact): { email?: string; name?: string } {
    return typeof from === "string" ? { email: from } : from;
  }

  private processAttachments(options: SendEmailOptions) {
    const attachments: { type: string; value: string }[] = [];

    const processAttachment = (attachment: AttachmentFile) => {
      const path = typeof attachment === "string" ? attachment : attachment.path;
      const name =
        typeof attachment === "string"
          ? attachment.split("/").pop() || ""
          : attachment.name || attachment.path.split("/").pop() || "";

      attachments.push({
        type: `${mime.getType(path)}; name=${name}`,
        value: readFileSync(path).toString(),
        // Base64 encoding is not working with MailChannels at the moment
        // value: readFileSync(path).toString("base64"),
        // headers: {
        //   "Content-Transfer-Encoding": "base64",
        // },
      });
    };

    if (options.attachments) {
      if (Array.isArray(options.attachments)) {
        for (const attachment of options.attachments) {
          processAttachment(attachment);
        }
      } else {
        processAttachment(options.attachments);
      }
    }

    return attachments;
  }

  private createContent(options: SendEmailOptions) {
    const content = [];

    if (options.text) {
      content.push({ type: "text/plain", value: options.text });
    }

    if (options.html && !options.react) {
      content.push({ type: "text/html", value: options.html });
    }

    if (!options.html && options.react) {
      const element = React.createElement(React.Fragment, null, options.react);
      const doctype =
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
      let markup = ReactDOMServer.renderToStaticMarkup(element);
      const hasHtmlTag = markup.match(/<html>/gi);
      if (!hasHtmlTag) {
        markup = `<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body>${markup}</body></html>`;
      }
      const document = `${doctype}${markup}`;
      content.push({ type: "text/html", value: document });
    }

    if (options.attachments) {
      content.push(...this.processAttachments(options));
    }

    return content;
  }

  private processHeaders(options: SendEmailOptions) {
    const headers: { [key: string]: string } = {};

    if (options.unsubscribe) {
      if (typeof options.unsubscribe === "string") {
        headers["List-Unsubscribe"] = `<${options.unsubscribe}>`;
      } else {
        const { email, url } = options.unsubscribe;

        if (email && url) {
          headers["List-Unsubscribe"] = `<mailto:${email}?subject=Unsubscribe>, <${url}>`;
        } else if (email) {
          headers["List-Unsubscribe"] = `<mailto:${email}?subject=Unsubscribe>`;
        } else if (url) {
          headers["List-Unsubscribe"] = `<${url}>`;
        }
      }
    }

    return Object.keys(headers).length ? headers : undefined;
  }

  public async sendEmail(options: SendEmailOptions): Promise<SendEmailResponse> {
    try {
      sendEmailOptionsSchema.parse(options);
    } catch (error) {
      const errors = (error as ZodError).errors.map((e) => e.path.join(".") + ": " + e.message);
      throw new Error(JSON.stringify(errors));
    }

    const { to, bcc, cc, replyTo, from } = this.processRecipients(options);
    const domain = this.extractDomain(options.from);
    const headers = this.processHeaders(options);
    const content = this.createContent(options);

    try {
      const { status, data } = await this.api.post("/send", {
        personalizations: [
          {
            to,
            bcc,
            cc,
            reply_to: replyTo,
            dkim_domain: this.dkimPrivateKey && domain,
            dkim_selector: this.dkimPrivateKey && "mailchannels",
            dkim_private_key: this.dkimPrivateKey,
          },
        ],
        headers,
        from,
        subject: options.subject,
        content,
      });

      return { status, data };
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }
}
