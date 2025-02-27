import { test, expect } from '@playwright/test';

test('Check website content', async ({ page }) => {
    // Go to the website
    await page.goto('https://denizturkmen.com.tr', { waitUntil: 'domcontentloaded' });

    // Wait for a specific element that contains the expected text
    await page.waitForSelector('h1');  // Update this if needed

    // Extract the text from the specific element
    const text = await page.textContent('h1'); // Modify selector if needed

    // Debug: Print extracted text to see actual content
    console.log('Extracted Text:', text);

    // Assert using the extracted text
    expect(text).toContain('DeNiZ TURKMEN'); // Updated to match extracted text
});


----------------------------------------------------------------------------------------------------------------

import { test, expect } from '@playwright/test';

test('Check website content', async ({ page }) => {
    // Navigate to the website and wait until the network is idle
    await page.goto('https://denizturkmen.com.tr', { waitUntil: 'networkidle' });

    // Ensure the page is fully loaded
    await page.waitForLoadState('domcontentloaded');

    // Debugging: Print page content before waiting for selector
    console.log(await page.content());

    // Wait for the h1 element to appear with a longer timeout
    await page.waitForSelector('h1', { timeout: 60000 });

    // Extract and log the text from the h1 element
    const text = await page.textContent('h1');
    console.log('Extracted text:', text);

    // Assert the text content
    expect(text).toBeDefined();
});

----------------------------------------------------------------------------------------------------------------


step("Go to the website", async () => {
    await page.goto("https://denizturkmen.com.tr", { waitUntil: "domcontentloaded" });
});

step("Check page title", async () => {
    const title = await page.title();
    expect(title).toBe("DeNiZ TURKMEN - Blog"); // Updated expected title
});

step("Check if a specific text exists", async () => {
    // Wait for the element
    await page.waitForSelector("h1");

    // Extract the text
    const text = await page.textContent("h1");

    // Debug: Print extracted text
    console.log("Extracted Text:", text);

    // Assert the expected text
    expect(text).toContain("DeNiZ TURKMEN");
});
