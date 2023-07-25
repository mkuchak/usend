import { z } from "zod";

const emailContactSchema = z.union([
  z.string().email(),
  z.object({
    email: z.string().email(),
    name: z.string().optional(),
  }),
]);

const attachmentFileSchema = z.union([
  z.string(),
  z.object({
    path: z.string(),
    name: z.string().optional(),
  }),
]);

const listUnsubscribeSchema = z.union([
  z.string().url(),
  z.object({
    email: z.string().email().optional(),
    url: z.string().url().optional(),
  }),
]);

export const sendEmailOptionsSchema = z
  .object({
    from: emailContactSchema,
    to: z.union([emailContactSchema, z.array(emailContactSchema)]),
    bcc: z.union([emailContactSchema, z.array(emailContactSchema)]).optional(),
    cc: z.union([emailContactSchema, z.array(emailContactSchema)]).optional(),
    replyTo: emailContactSchema.optional(),
    subject: z.string(),
    attachments: z.union([attachmentFileSchema, z.array(attachmentFileSchema)]).optional(),
    unsubscribe: listUnsubscribeSchema.optional(),
    text: z.string().optional(),
    html: z.string().optional(),
    react: z.custom<React.ReactNode>().optional(),
  })
  .refine((data) => data.text || data.html || data.react, {
    path: ["text, html or react"],
    message: "At least one of these parameters is required",
  });
