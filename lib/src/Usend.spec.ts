import nock from "nock";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { Usend } from "./Usend";
import { MailSendBody } from "./usend";

const usendOptions = {
  vendorUrl: "https://api.example.com",
  vendorApiKey: "API_KEY",
  dkimPrivateKey: "DKIM_PRIVATE_KEY",
};

const sendEmailOptions = {
  from: "sender@example.com",
  to: "recipient@example.com",
  subject: "Test Subject",
  text: "Test plain text",
};

beforeAll(() => {
  nock.disableNetConnect();
});

afterAll(() => {
  nock.enableNetConnect();
});

afterEach(() => {
  nock.cleanAll();
});

describe("Usend class", () => {
  it("should create a instance of Usend", async () => {
    const usend = new Usend(usendOptions);

    expect(usend).toBeInstanceOf(Usend);
  });

  it("should throw an error if the vendor API is invalid", async () => {
    expect(() => new Usend({ ...usendOptions, vendorUrl: "invalid" })).toThrow("Invalid Vendor URL");
  });

  it("should throw an error if the vendor API is set but key is not set", async () => {
    expect(() => new Usend({ ...usendOptions, vendorApiKey: "" })).toThrow("Vendor API Key is required");
  });

  it("should send an email with the default options", async () => {
    nock(usendOptions.vendorUrl).post("/send").reply(202);

    const usend = new Usend(usendOptions);
    const { status } = await usend.sendEmail(sendEmailOptions);

    expect(status).toBe(202);
  });

  it("should throw an error if the email options are invalid", async () => {
    const usend = new Usend(usendOptions);

    const invalidOptions = {
      ...sendEmailOptions,
      to: "invalid_email",
      bcc: [{ email: "invalid_email" }],
      cc: [{ name: "Name with no email" }],
      replyTo: "invalid_email",
    };

    try {
      await usend.sendEmail(invalidOptions);
    } catch (error) {
      const errors = JSON.parse((error as Error).message);
      expect(errors).toContain("to: Invalid email");
      expect(errors).toContain("bcc.0.email: Invalid email");
      expect(errors).toContain("cc: Invalid input");
      expect(errors).toContain("replyTo: Invalid email");
    }
  });

  it("should process from, to, bcc, cc and replyTo options before to send the email", async () => {
    let payload: MailSendBody;

    nock(usendOptions.vendorUrl)
      .post("/send", (body: MailSendBody) => ((payload = body), true))
      .reply(202);

    const usend = new Usend(usendOptions);

    const options = {
      ...sendEmailOptions,
      from: "noreply@example.com",
      to: [
        "johndoe@example.com",
        "emilyjohnson@example.com",
        { email: "williambrown@example.com", name: "William Brown" },
      ],
      bcc: [{ email: "janedoe@example.com", name: "Jane Doe" }, "oliviadavis@example.com"],
      cc: [
        { email: "michaelsmith@example.com", name: "Michael Smith" },
        "jameswilson@example.com",
        { email: "sophiamartinez@example.com" },
      ],
      replyTo: { email: "benjaminanderson@example.com", name: "Benjamin Anderson" },
    };

    await usend.sendEmail(options);

    const { from } = payload;
    const { to, bcc, cc, reply_to: replyTo } = payload.personalizations[0];

    expect(from).toEqual({
      email: "noreply@example.com",
    });
    expect(to).toEqual([
      {
        email: "johndoe@example.com",
      },
      {
        email: "emilyjohnson@example.com",
      },
      {
        email: "williambrown@example.com",
        name: "William Brown",
      },
    ]);
    expect(bcc).toEqual([{ email: "janedoe@example.com", name: "Jane Doe" }, { email: "oliviadavis@example.com" }]);
    expect(cc).toEqual([
      { email: "michaelsmith@example.com", name: "Michael Smith" },
      { email: "jameswilson@example.com" },
      { email: "sophiamartinez@example.com" },
    ]);
    expect(replyTo).toEqual({
      email: "benjaminanderson@example.com",
      name: "Benjamin Anderson",
    });
  });
});
