'use server';

import { z } from 'zod';
import { Resend } from 'resend';

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

type ContactFormInput = z.infer<typeof formSchema>;

const resend = new Resend(process.env.RESEND_API_KEY);
const toEmail = process.env.TO_EMAIL;

export async function submitContactForm(input: ContactFormInput) {
  if (!toEmail) {
    console.error('TO_EMAIL environment variable is not set.');
    return { success: false, error: 'Server configuration error.' };
  }

  try {
    const { name, email, message } = formSchema.parse(input);

    const { data, error } = await resend.emails.send({
      from: 'Contact Form <no-reply@velisodesign.com>', // or your verified domain
      to: [toEmail],
      subject: `New message from ${name}`,
      html: `
        <p>You have received a new message from your website contact form.</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: 'Failed to send email.' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error submitting form:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input.' };
    }
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
