import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
const [url, out, mode] = process.argv.slice(2);
const port = 9334, prof = mkdtempSync(tmpdir() + '/bc-vid-');
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--no-first-run', '--hide-scrollbars', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws, id = 0; const pending = new Map();
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 400)); return r.result.value; };
try {
  let target;
  for (let i = 0; i < 40 && !target; i++) { await sleep(250); try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === 'page'); } catch (e) {} }
  ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { const p = pending.get(d.id); pending.delete(d.id); d.error ? p.rej(new Error(d.error.message)) : p.res(d.result); } };
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 360, height: 640, deviceScaleFactor: 3, mobile: false });
  await send('Page.navigate', { url }); await sleep(1200);
  console.log('ready', JSON.stringify(await ev('window.ready')), 'dur', await ev('window.DUR'));
  const FPS = 30, DUR = await ev('window.DUR');
  const times = mode === 'stills' ? [0.3, 1.8, 3.2, 3.7, 5.8, 8.6, 11.2, 13.4, 16.2, 18.2, 20.4, 22.6, 25.5] : Array.from({ length: Math.round(DUR * FPS) }, (_, i) => i / FPS);
  let n = 0;
  for (const t of times) {
    await ev(`(async()=>{seek(${t});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))})()`);
    const r = await send('Page.captureScreenshot', mode === 'stills' ? { format: 'png' } : { format: 'jpeg', quality: 96 });
    const name = mode === 'stills' ? `still-${String(t.toFixed(1)).padStart(4, '0')}.png` : `f${String(n).padStart(4, '0')}.jpg`;
    writeFileSync(`${out}/${name}`, Buffer.from(r.data, 'base64')); n++;
    if (mode !== 'stills' && n % 150 === 0) console.log('frames', n);
  }
  console.log('wrote', n);
} catch (e) { console.log('RENDER FAILED', e.message); process.exitCode = 1; }
finally { try { ws?.close(); } catch (e) {} chrome.kill(); }
