import { randomUUID } from "node:crypto";
import { Usend } from "usend-email";
import { EmailTemplate } from "./EmailTemplate";

const usend = new Usend();

const main = async () => {
  const [userId, firstName] = [randomUUID(), "John"];

  try {
    await usend.sendEmail({
      from: "welcome@example.com",
      to: `${userId}@mailsac.com`,
      subject: `Welcome to Usend!`,
      react: EmailTemplate({ firstName }),
    });

    console.log(`Check the link https://mailsac.com/inbox/${userId}@mailsac.com to view the sent email.`);
  } catch (error) {
    console.error(error);
  }
};

main();
