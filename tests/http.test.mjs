import test from 'node:test';
import assert from 'node:assert/strict';
const origin='http://127.0.0.1:4173';
for(const [file,type] of [['/','text/html'],['/app.js','text/javascript'],['/core.js','text/javascript'],['/styles.css','text/css'],['/risk_thresholds.json','application/json']])test(`HTTP asset executes: ${file}`,async()=>{const r=await fetch(origin+file);assert.equal(r.status,200);assert.ok(r.headers.get('content-type').includes(type));assert.ok((await r.text()).length>20);});
test('Unknown files and unavailable APIs return 404',async()=>{for(const p of ['/missing-file.js','/api/risk/predict','/api/auth'])assert.equal((await fetch(origin+p)).status,404);});
test('Encoded path traversal does not expose project source',async()=>{const r=await fetch(origin+'/%2e%2e%5cpackage.json');assert.notEqual(r.status,200);});
test('Head request has no response body',async()=>{const r=await fetch(origin,{method:'HEAD'});assert.equal(r.status,200);assert.equal(await r.text(),'');});
