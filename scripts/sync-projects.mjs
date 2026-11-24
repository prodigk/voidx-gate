import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const projectOrder = JSON.parse(readFileSync(new URL('../data/project-order.json', import.meta.url), 'utf8'));
const rank = new Map(projectOrder.map((name, index) => [name, index]));

// Authentication stays inside the local Vercel CLI. Never ship account credentials.
const projects = [];
let next;
do {
  const args = ['project', 'ls', '--json', '--scope', 'ugens-projects'];
  if (next) args.push('--next', String(next));
  const page = JSON.parse(execFileSync('vercel', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }));
  projects.push(...page.projects);
  next = page.pagination?.next;
} while (next);

const sites = projects
  .filter(p => p.latestProductionUrl && !['voidx', 'voidx-gate'].includes(p.name))
  .map(p => {
    const result = JSON.parse(execFileSync('vercel', ['api', `/v9/projects/${encodeURIComponent(p.name)}/domains`, '--scope', 'ugens-projects'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }));
    const domains = result.domains.filter(d => d.verified && !d.gitBranch && !d.customEnvironmentId && !d.redirect);
    const primary = domains.find(d => !d.name.endsWith('.vercel.app')) || domains.find(d => d.name === `${p.name}.vercel.app`) || domains[0];
    const url = new URL(primary ? `https://${primary.name}` : p.latestProductionUrl);
    if (url.protocol !== 'https:') throw new Error(`Unexpected URL for ${p.name}`);
    return { name: p.name, url: url.href, updatedAt: p.updatedAt };
  })
  .sort((a, b) => (rank.get(a.name) ?? Infinity) - (rank.get(b.name) ?? Infinity) || b.updatedAt - a.updatedAt);
await Promise.all(sites.map(async site => {
  try {
    const response = await fetch(site.url, { method: 'GET', signal: AbortSignal.timeout(12000) });
    site.httpStatus = response.status;
    await response.body?.cancel();
  } catch {
    site.httpStatus = null;
  }
}));
writeFileSync(new URL('../data/projects.json', import.meta.url), JSON.stringify({ syncedAt: new Date().toISOString(), sites }, null, 2) + '\n');
console.log(`Synced ${sites.length} production sites.`);
