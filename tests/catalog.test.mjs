import test from 'node:test';
import assert from 'node:assert/strict';
import { products, categories, installationLabels } from '../data.js';

test('catalogue contains 24 unique products across 8 nonempty categories', () => {
  assert.equal(products.length, 24);
  assert.equal(categories.length, 8);
  assert.equal(new Set(products.map(p=>p.id)).size, 24);
  for(const c of categories) assert.ok(products.some(p=>p.category===c.id));
});
test('every product has an official source, installation guidance and no invented commerce data', () => {
  for(const p of products) {
    assert.ok(categories.some(c=>c.id===p.category));
    assert.ok(installationLabels[p.installation]);
    assert.equal(p.price,null);
    assert.equal(p.stock,null);
    assert.equal(p.availabilityStatus,'unconfirmed');
    assert.ok(p.features.length>=3 && p.requirements.length>=2 && p.steps.length===3);
    assert.ok(['www.ezviz.com','www.tp-link.com','www.sandisk.com'].includes(new URL(p.source).hostname));
    assert.equal(new URL(p.image).protocol,'https:');
    assert.equal(p.reviewedAt,'2026-10-07');
    assert.equal('rating' in p,false);
    assert.equal('reviews' in p,false);
  }
});
test('hub-dependent sensors explicitly require A3', () => {
  const sensors=products.filter(p=>p.requiresHub);
  assert.deepEqual(sensors.map(p=>p.id).sort(),['ezviz-t10c','ezviz-t1c','ezviz-t2c']);
  for(const p of sensors) assert.ok(p.requirements.join(' ').includes('A3'));
  assert.ok(products.some(p=>p.id==='ezviz-a3'));
});
