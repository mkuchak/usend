import axios, { AxiosInstance } from "axios";
import * as React from "react";
import ReactDOMServer from "react-dom/server";
import { ZodError } from "zod";
import { version } from "../package.json";
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
    const to = Array.isArray(options.to) ? options.to : [{ email: options.to }];

    const processRecipientsArray = (recipient: string | EmailContact[]) => {
      if (typeof recipient === "string") {
        return [{ email: recipient }];
      }
      return recipient?.map((item) => (typeof item === "string" ? { email: item } : item));
    };

    const bcc = processRecipientsArray(options.bcc);
    const cc = processRecipientsArray(options.cc);
    const replyTo = processRecipientsArray(options.replyTo);

    return { to, bcc, cc, replyTo, from: this.extractSender(options.from) };
  }

  private extractDomain(from: EmailContact) {
    if (typeof from === "string") {
      return from.split("@")[1];
    }
    return from?.email?.split("@")[1];
  }

  private extractSender(from: EmailContact): { email?: string; name?: string } {
    return typeof from === "string" ? { email: from } : from;
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
      const markup = ReactDOMServer.renderToStaticMarkup(element);
      const document = `${doctype}${markup}`;
      content.push({ type: "text/html", value: document });
    }

    return content;
  }

  public async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      sendEmailOptionsSchema.parse(options);
    } catch (error) {
      const errors = (error as ZodError).errors.map((e) => e.path.join(".") + ": " + e.message);
      throw new Error(JSON.stringify({ errors }, null, 2));
    }

    const { to, bcc, cc, replyTo, from } = this.processRecipients(options);
    const domain = this.extractDomain(options.from);
    const content = this.createContent(options);

    try {
      const { data } = await this.api.post("/send", {
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
        from,
        subject: options.subject,
        content,
      });

      return data;
    } catch (error) {
      throw new Error(JSON.stringify(error, null, 2));
    }
  }
}
