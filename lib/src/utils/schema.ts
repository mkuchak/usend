import { z } from "zod";

const emailContactSchema = z.union([
  z.string(),
  z.object({
    email: z.string(),
    name: z.string().optional(),
  }),
]);

export const sendEmailOptionsSchema = z
  .object({
    from: emailContactSchema,
    to: z.union([emailContactSchema, z.array(emailContactSchema)]),
    bcc: z.union([emailContactSchema, z.array(emailContactSchema)]).optional(),
    cc: z.union([emailContactSchema, z.array(emailContactSchema)]).optional(),
    replyTo: z
      .union([emailContactSchema, z.array(emailContactSchema)])
      .optional(),
    subject: z.string(),
    text: z.string().optional(),
    html: z.string().optional(),
    react: z.custom<React.ReactNode>().optional(),
  })
  .refine((data) => data.text || data.html || data.react, {
    path: ["text, html or react"],
    message: "At least one of these parameters is required",
  });
