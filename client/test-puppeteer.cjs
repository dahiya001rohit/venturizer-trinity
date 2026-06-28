const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Catch and print all console logs/errors
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()} ${msg.text()}`);
  });
  page.on('pageerror', err => {
    console.error(`[BROWSER ERROR] ${err.toString()}`);
  });

  console.log("Navigating to login...");
  await page.goto('http://localhost:5173/login');
  
  // login
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', 'admin@venturizer.com');
  await page.type('input[type="password"]', 'admin');
  await page.click('button[type="submit"]');

  // wait for navigation to dashboard
  await page.waitForNavigation();
  console.log("Logged in, at URL:", page.url());

  // Wait for settings link to appear
  await page.waitForSelector('a[href="/settings"]');
  console.log("Clicking Settings...");
  
  await Promise.all([
    page.click('a[href="/settings"]'),
    // Wait for the URL to change to /settings
    page.waitForFunction("window.location.pathname === '/settings'", { timeout: 5000 })
  ]);
  
  console.log("At URL:", page.url());
  
  // Wait a bit to let React render
  await new Promise(r => setTimeout(r, 2000));
  
  // Check what's rendered
  const html = await page.content();
  if (html.includes('Chat Flow Questions')) {
    console.log("SUCCESS: Settings page rendered Chat Flow Questions.");
  } else if (html.includes('Loading flow...')) {
    console.log("STUCK: Settings page is stuck on Loading flow...");
  } else {
    console.log("BLANK: Settings page didn't render correctly.");
  }

  await browser.close();
})();
