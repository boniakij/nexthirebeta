const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Loading calendar page...');
    await page.goto('http://localhost:3000/trainer/availability', { waitUntil: 'networkidle', timeout: 30000 });
    
    console.log('✅ Page loaded');
    
    // Take screenshot
    await page.screenshot({ path: '/tmp/calendar_screenshot.png', fullPage: true });
    console.log('✅ Screenshot saved');
    
    // Check calendar content
    const hasCalendarTitle = await page.locator('text=Availability Calendar').count() > 0;
    console.log('Calendar title:', hasCalendarTitle ? '✅' : '❌');
    
    const hasGrid = await page.locator('div.grid.grid-cols-7').count() > 0;
    console.log('Calendar grid:', hasGrid ? '✅' : '❌');
    
    const dayCells = await page.locator('div.aspect-square').count();
    console.log('Day cells:', dayCells);
    
    const hasLegend = await page.locator('text=Available').count() > 0;
    console.log('Legend present:', hasLegend ? '✅' : '❌');
    
    const hasStats = await page.locator('text=Total Slots').count() > 0;
    console.log('Statistics:', hasStats ? '✅' : '❌');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
