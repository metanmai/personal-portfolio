import { chromium } from 'playwright';

const BASE = 'http://localhost:5174';
const out = [];
const log = (i, m) => out.push(`${i} ${m}`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

// 1. boot v2: uplink stage with globe
await page.goto(BASE);
await page.waitForTimeout(1200);
let body = await page.textContent('body');
log(body.includes('ESTABLISHING UPLINK') ? '✅' : '❌', 'Stage 1: ESTABLISHING UPLINK renders');
const globe1 = await page.textContent('pre').catch(() => '');
await page.waitForTimeout(500);
const globe2 = await page.textContent('pre').catch(() => '');
log(globe1 !== globe2 && globe1.includes('·') ? '✅' : '❌', 'ASCII globe present and rotating');
await page.screenshot({ path: '/tmp/termlink-verify/40-boot-uplink.png' });

// 2. report stage with live data, then HOLDS at login (no auto-dismiss)
await page.waitForSelector('text=IDENTIFY USER', { timeout: 20000 });
body = await page.textContent('body');
log(body.includes('NODE ADDR') ? '✅' : '❌', `NODE ADDR (IP) line present`);
log(body.includes('REGION') && body.includes('BROWSER') && body.includes('CPU') ? '✅' : '❌', 'Visitor report: REGION/BROWSER/CPU lines');
log(!body.includes('SKIP') ? '✅' : '❌', 'No skip hint anywhere');
await page.screenshot({ path: '/tmp/termlink-verify/41-boot-report.png' });

// holds: wait 4s, still on login
await page.waitForTimeout(4000);
body = await page.textContent('body');
log(body.includes('IDENTIFY USER') ? '✅' : '❌', 'Boot HOLDS at login prompt (user-paced, no timeout)');

// 3. press key → GUEST types → ACCESS GRANTED → menu
await page.keyboard.press('Enter');
await page.waitForTimeout(1100);
body = await page.textContent('body');
log(body.includes('GUEST') ? '✅' : '❌', 'Keypress fake-types GUEST');
await page.screenshot({ path: '/tmp/termlink-verify/42-boot-login.png' });
await page.waitForSelector('text=SYSTEM STATUS', { timeout: 5000 });
log('✅', 'ACCESS GRANTED → main menu');

// 4. new menu: 4 entries, no calibration
const menuText = await page.textContent('main');
const want = ['PERSONNEL FILE', 'CAREER DOSSIER', 'RECREATION WING', 'OPEN COMMS CHANNEL'];
log(want.every(w => menuText.includes(w)) && !menuText.includes('CALIBRATION') ? '✅' : '❌',
  'Menu = 4 entries (journey/career/recreation/comms), calibration gone');
await page.screenshot({ path: '/tmp/termlink-verify/43-menu-v3.png' });

// 5. career dossier: all work in one
await page.keyboard.press('2');
await page.waitForSelector('text=SERVICE RECORD');
const career = await page.textContent('body');
log(['PROJECT ARCHIVES', 'FIELD COMMENDATIONS', 'EXPORT'].every(s => career.includes(s)) ? '✅' : '❌',
  'CAREER DOSSIER: service record + projects + commendations + export in one screen');
await page.click('text=FILE_001');
await page.waitForSelector('img[alt*="BLOCKTOPIA"]');
log('✅', 'Project files still expand with phosphor image inside dossier');
await page.screenshot({ path: '/tmp/termlink-verify/44-career.png', fullPage: true });

// 6. recreation wing
await page.keyboard.press('Escape'); await page.waitForTimeout(350);
await page.keyboard.press('3');
await page.waitForSelector('text=GAME LOG');
const rec = await page.textContent('body');
log(['AUDIO LOG', 'FIELD CAMERA', 'SIDE QUESTS', 'FALLOUT: NEW VEGAS'].every(s => rec.includes(s)) ? '✅' : '❌',
  'RECREATION WING: games/music/photos/side-quests sections render');
await page.screenshot({ path: '/tmp/termlink-verify/45-recreation.png', fullPage: true });

// 7. personnel = journey not CV
await page.keyboard.press('Escape'); await page.waitForTimeout(350);
await page.keyboard.press('1');
await page.waitForSelector('text=THE JOURNEY');
const pers = await page.textContent('body');
log(pers.includes('FIRST CONTACT WITH A COMPUTER') && !pers.includes('SERVICE RECORD') ? '✅' : '❌',
  'PERSONNEL FILE is journey timeline, no work history');

// 8. theme toggle in status bar
await page.click('button:has-text("PHOSPHOR")');
await page.waitForTimeout(300);
const theme = await page.evaluate(() => document.documentElement.dataset.theme);
log(theme === 'green' ? '✅' : '❌', `StatusBar [PHOSPHOR] toggle → ${theme}`);
await page.screenshot({ path: '/tmp/termlink-verify/46-green-toggle.png' });
await page.click('button:has-text("PHOSPHOR")');

// 9. old routes 404
await page.goto(BASE + '/calibration');
await page.keyboard.press('Enter'); // through boot login? boot needs full flow on goto...
await page.waitForSelector('text=IDENTIFY USER', { timeout: 20000 });
await page.keyboard.press('Enter');
await page.waitForSelector('text=FILE CORRUPTED', { timeout: 6000 });
log('✅', '/calibration now FILE CORRUPTED (route removed)');

// 🔍 probes
// reduced motion: instant report, still holds at login
const rm = await browser.newContext({ reducedMotion: 'reduce' });
const prm = await rm.newPage();
await prm.goto(BASE);
await prm.waitForSelector('text=IDENTIFY USER', { timeout: 8000 });
log('🔍', 'Probe: reduced-motion renders report instantly, still holds at login');
await prm.keyboard.press('a');
await prm.waitForSelector('text=SYSTEM STATUS', { timeout: 5000 });
log('🔍', 'Probe: any key (not just Enter) logs in');
await rm.close();

// mobile boot + tap login
const m = await browser.newPage({ viewport: { width: 375, height: 740 } });
await m.goto(BASE);
await m.waitForSelector('text=IDENTIFY USER', { timeout: 20000 });
await m.click('body');
await m.waitForSelector('text=SYSTEM STATUS', { timeout: 5000 });
const ovf = await m.evaluate(() => document.scrollingElement.scrollWidth - document.scrollingElement.clientWidth);
log(ovf <= 0 ? '🔍' : '❌', `Probe: mobile tap-login works; menu overflow ${ovf}px`);
await m.close();

await browser.close();
console.log(out.join('\n'));
console.log('JS ERRORS:', errors.length ? [...new Set(errors)].join(' | ') : 'none');
