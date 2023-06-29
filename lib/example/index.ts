import { randomUUID } from "node:crypto";
import { Usend } from "usend-email";
import { EmailTemplate } from "./EmailTemplate";

const usend = new Usend();

const main = async () => {
  const uuid = randomUUID();
  const firstName = ["John", "Jane", "Jack", "Jill", "James", "Jenny"][
    Math.floor(Math.random() * 5)
  ];

  try {
    await usend.sendEmail({
      from: "sender@example.com",
      to: `recipient-${uuid}@mailsac.com`,
      subject: `Welcome to Usend!`,
      react: EmailTemplate({ firstName }),
    });

    console.log(
      `Check the link https://mailsac.com/inbox/recipient-${uuid}@mailsac.com to view the sent email.`
    );
  } catch (error) {
    console.error(error);
  }
};

main();
