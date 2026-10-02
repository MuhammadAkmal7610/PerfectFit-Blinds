import { z } from "zod";

const serviceablePostcodeAreas = ["M", "BL", "SK", "OL", "WN", "WA", "BB", "HD", "HX", "PR"];

export function isServiceablePostcode(postcode: string) {
  const area = postcode.trim().toUpperCase().match(/^[A-Z]{1,2}/)?.[0];
  return Boolean(area && serviceablePostcodeAreas.includes(area));
}

export const blindOptions = [
  "Perfect Fit blinds",
  "Roller blinds",
  "Venetian blinds",
  "Vertical blinds",
  "Roman blinds",
  "Blackout blinds",
  "Made-to-measure blinds",
  "Not sure yet",
] as const;

export const serviceOptions = ["Free home measurement", "Free quote", "Both"] as const;

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100, "Name must be 100 characters or fewer."),
  telephone: z.string().trim().refine(
    (value) => /^[+()\d\s.-]+$/.test(value) && value.replace(/\D/g, "").length >= 10 && value.replace(/\D/g, "").length <= 15,
    "Please enter a valid telephone number.",
  ),
  email: z.email("Please enter a valid email address.").max(254, "Email address is too long."),
  postcode: z.string()
    .trim()
    .regex(/^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i, "Please enter a valid UK postcode.")
    .refine(isServiceablePostcode, "We currently serve Manchester and nearby areas. Please contact us to check your postcode."),
  blind_type: z.enum(blindOptions, { error: "Please choose the type of blinds." }),
  number_of_windows: z.coerce.number().int().min(1, "At least 1 window is required.").max(100, "Please contact us for projects over 100 windows."),
  preferred_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a valid appointment date.")
    .refine((value) => {
      const [year, month, day] = value.split("-").map(Number);
      const selectedDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate.getFullYear() === year
        && selectedDate.getMonth() === month - 1
        && selectedDate.getDate() === day
        && selectedDate >= today;
    }, "Please choose today or a future date."),
  service_required: z.enum(serviceOptions),
  message: z.string().trim().max(500, "Message must be 500 characters or fewer.").optional().or(z.literal("")),
  website: z.string().max(200).optional().or(z.literal("")),
});

export type EnquiryFormInput = z.input<typeof enquirySchema>;
export type EnquiryFormValues = z.output<typeof enquirySchema>;