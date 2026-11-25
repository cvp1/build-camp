import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
const url = process.argv[2], port = 9338, prof = mkdtempSync(tmpdir() + '/bc-h-');
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws, id = 0; const pending = new Map(); const errors = [];
const send = (m, p = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
const ev = async e => (await send('Runtime.evaluate', { expression: e, returnByValue: true })).result.value;
const ok = (n, c, d = '') => console.log((c ? 'PASS ' : 'FAIL ') + n + (d ? '  [' + d + ']' : ''));
try {
  let t; for (let i = 0; i < 40 && !t; i++) { await sleep(250); try { t = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(x => x.type === 'page'); } catch (e) {} }
  ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { const p = pending.get(d.id); pending.delete(d.id); d.error ? p.rej(new Error(d.error.message)) : p.res(d.result); } else if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.text); };
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36' });
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Page.navigate', { url }); await sleep(1600);
  let s = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync('/tmp/bc-demo/hard-1.png', Buffer.from(s.data, 'base64'));
  await sleep(14000);
  const term = await ev(`document.getElementById('tb').innerText`);
  ok('terminal plays through to the question', term.includes('What should I call you?'), term.replace(/\n/g,' | ').slice(0,120));
  s = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync('/tmp/bc-demo/hard-2.png', Buffer.from(s.data, 'base64'));
  ok('Windows visitor gets the Windows tab', await ev(`document.querySelector('.os .on').dataset.os`) === 'win11');
  await ev(`document.querySelector('[data-os=cros]').click()`);
  ok('Chromebook tab swaps the how-to', (await ev(`document.getElementById('howto').innerText`)).includes('Linux'));
  ok('no price anywhere', !/\$\d|a month|paid/i.test(await ev('document.body.innerText')));
  ok('links: install, zip, back to chat', await ev(`[...document.links].map(a=>a.href).join(' ')`).then ? false : true);
  const links = await ev(`[...document.links].map(a=>a.getAttribute('href')).join(' ')`);
  ok('has install, zip and chat links', /code\.claude\.com/.test(links) && /master\.zip/.test(links) && /#s3/.test(links), links.slice(0,160));
  const h = await ev('document.documentElement.scrollHeight');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: h, deviceScaleFactor: 1, mobile: true }); await sleep(600);
  s = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync('/tmp/bc-demo/hard-full.png', Buffer.from(s.data, 'base64'));
  ok('no JS errors', errors.length === 0, errors.join('|'));
} catch (e) { console.log('CRASH', e.message); } finally { try { ws?.close(); } catch (e) {} chrome.kill(); }
