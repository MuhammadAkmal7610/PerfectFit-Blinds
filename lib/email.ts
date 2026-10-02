import "server-only";
import type { EnquiryRecord } from "@/lib/db";

function formatEmailDetails(enquiry: EnquiryRecord) {
  return [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Telephone: ${enquiry.telephone}`,
    `Postcode: ${enquiry.postcode}`,
    `Blind type: ${enquiry.blind_type}`,
    `Windows: ${enquiry.number_of_windows}`,
    `Preferred date: ${enquiry.preferred_date}`,
    `Service requested: ${enquiry.service_required}`,
    `Message: ${enquiry.message || "No additional message"}`,
  ].join("\n");
}

async function sendEmail(to: string, subject: string, text: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [to],
      subject,
      text,
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Resend returned status ${response.status}.`);
  }
}

export async function sendEnquiryNotifications(enquiry: EnquiryRecord) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();
  const businessEmail = process.env.BUSINESS_NOTIFICATION_EMAIL?.trim();

  if (!apiKey || !fromEmail || !businessEmail) {
    console.warn("Enquiry email notifications are disabled because Resend is not fully configured.");
    return false;
  }

  const details = formatEmailDetails(enquiry);
  const results = await Promise.allSettled([
    sendEmail(
      enquiry.email,
      "We've received your blinds enquiry",
      `Hi ${enquiry.name},\n\nThanks for getting in touch with PerfectFit Blinds. We've received your request and our Manchester team will be in touch shortly.\n\nYour request:\n${details}\n\nPerfectFit Blinds`,
    ),
    sendEmail(
      businessEmail,
      `New blinds enquiry from ${enquiry.name}`,
      `A new enquiry has been submitted.\n\n${details}\n\nLead ID: ${enquiry.id}`,
    ),
  ]);

  const failedNotifications = results.filter((result) => result.status === "rejected");
  if (failedNotifications.length > 0) {
    console.error(`Resend failed to deliver ${failedNotifications.length} notification(s) for enquiry ${enquiry.id}.`);
    return false;
  }

  return true;
}