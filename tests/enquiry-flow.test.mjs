import assert from "node:assert/strict";
import { test } from "node:test";

const baseUrl = process.env.TEST_BASE_URL;
const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

test("submitted enquiry appears in the authenticated dashboard feed", { skip: !baseUrl || !username || !password }, async () => {
  const login = await fetch(new URL("/api/admin/login", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  assert.equal(login.status, 200, "admin credentials should sign in");
  const cookie = login.headers.get("set-cookie")?.split(";")[0];
  assert.ok(cookie, "login should set an admin session cookie");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const preferredDate = [tomorrow.getFullYear(), String(tomorrow.getMonth() + 1).padStart(2, "0"), String(tomorrow.getDate()).padStart(2, "0")].join("-");
  const email = `test-${Date.now()}@example.com`;
  const submission = await fetch(new URL("/api/enquiries", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Integration Test",
      telephone: "0161 555 0199",
      email,
      postcode: "M28 3AA",
      blind_type: "Roller blinds",
      number_of_windows: 2,
      preferred_date: preferredDate,
      service_required: "Free quote",
      message: "Automated end-to-end test",
    }),
  });
  assert.equal(submission.status, 201, "valid enquiry should be accepted");

  const dashboardFeed = await fetch(new URL("/api/enquiries", baseUrl), { headers: { Cookie: cookie } });
  assert.equal(dashboardFeed.status, 200, "admin should be able to load the dashboard feed");
  const { leads } = await dashboardFeed.json();
  assert.ok(leads.some((lead) => lead.email === email), "submitted enquiry should appear in the dashboard feed");
});