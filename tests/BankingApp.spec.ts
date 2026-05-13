import { test, expect } from "@playwright/test";
import config from "../config.json";

// Utility to capture screenshot on failure
test.describe.configure({
  retries: 0,
  timeout: 60000,
});

test("Banking App - Deposit Transaction Flow", async ({ page }, testInfo) => {
  // 1. Launch the application
  await page.goto(config.url);
  await expect(
    page.getByRole("heading", { name: /Practice Space/i }),
  ).toBeVisible();

  // 2. Enter Username
  await page.getByPlaceholder("Username").fill(config.username);
  // 3. Enter Password
  await page.getByPlaceholder("Password").fill(config.password);
  // 4. Select App Name
  await page.getByLabel("App Name:").selectOption({ label: config.appName });
  // 5. Click the Login button
  await page.getByRole("button", { name: /^Login$/ }).click();

  // Wait for redirect to banking app
  await expect(
    page.getByRole("heading", { name: /Sample Banking Application/i }),
  ).toBeVisible();

  // 6. Click "Quick Transactions"
  await page.getByRole("link", { name: /Quick Transactions/ }).click();
  await expect(
    page.getByRole("heading", { name: /Quick Transactions/i }),
  ).toBeVisible();

  // 7. Select Transaction Type: Deposit
  await page.getByLabel("Transaction Type:").selectOption({ label: "Deposit" });
  // 8. Enter Amount: 500
  await page.getByRole("spinbutton", { name: /Amount/ }).fill("500");
  // 9. Enter Description: QA Test
  await page.getByRole("textbox", { name: /Description/ }).fill("QA Test");
  // 10. Click the Submit button
  await page.getByRole("button", { name: /^Submit$/ }).click();

  // 11. On the Transaction Confirmation page, click the "Confirm" button.
  await expect(page.getByRole("button", { name: /^Confirm$/ })).toBeVisible();
  await page.getByRole("button", { name: /^Confirm$/ }).click();

  // 12. Validate that the message:
  //     "Transaction Completed Successfully!"
  //     is displayed on the Transaction Successful page.
  await expect(
    page.getByText("Transaction Completed Successfully!", { exact: false }),
  ).toBeVisible();

  // Attach screenshot on failure
  if (testInfo.status !== testInfo.expectedStatus) {
    await testInfo.attach("screenshot", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  }
});
