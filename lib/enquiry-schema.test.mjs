import assert from "node:assert/strict";
import { test } from "node:test";
import { enquirySchema, isServiceablePostcode } from "./enquiry-schema.ts";

function validEnquiry(overrides = {}) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const preferredDate = [tomorrow.getFullYear(), String(tomorrow.getMonth() + 1).padStart(2, "0"), String(tomorrow.getDate()).padStart(2, "0")].join("-");
  return {
    name: "Alex Taylor",
    telephone: "0161 555 0123",
    email: "alex@example.com",
    postcode: "M28 3AA",
    blind_type: "Roller blinds",
    number_of_windows: 3,
    preferred_date: preferredDate,
    service_required: "Free quote",
    ...overrides,
  };
}

test("accepts a valid Greater Manchester enquiry", () => {
  assert.equal(enquirySchema.safeParse(validEnquiry()).success, true);
});

test("rejects postcodes outside the service area", () => {
  const result = enquirySchema.safeParse(validEnquiry({ postcode: "SW1A 1AA" }));
  assert.equal(result.success, false);
  assert.equal(isServiceablePostcode("M28 3AA"), true);
  assert.equal(isServiceablePostcode("SW1A 1AA"), false);
});

test("rejects malformed UK postcodes and past appointment dates", () => {
  assert.equal(enquirySchema.safeParse(validEnquiry({ postcode: "Manchester" })).success, false);
  assert.equal(enquirySchema.safeParse(validEnquiry({ preferred_date: "2000-01-01" })).success, false);
});