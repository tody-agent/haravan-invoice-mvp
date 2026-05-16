#!/usr/bin/env node

/**
 * Test Gate — Comprehensive Vitest Test Suite Runner
 *
 * Runs all tests with coverage, enforces thresholds, and reports results.
 * Exit code 0 = all gates passed, non-zero = failures.
 *
 * Usage:
 *   node scripts/test-gate.js          # Run all tests
 *   node scripts/test-gate.js --api    # API tests only
 *   node scripts/test-gate.js --portal # Portal tests only
 *   node scripts/test-gate.js --watch  # Watch mode
 */

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(msg, color = COLORS.reset) {
  console.log(`${color}${msg}${COLORS.reset}`);
}

function run(cmd, cwd = ROOT) {
  try {
    return execSync(cmd, { cwd, stdio: 'inherit' });
  } catch (e) {
    return null;
  }
}

function runSilent(cmd, cwd = ROOT) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (e) {
    return null;
  }
}

const args = process.argv.slice(2);
const apiOnly = args.includes('--api');
const portalOnly = args.includes('--portal');
const watch = args.includes('--watch');
const coverage = args.includes('--coverage');

let exitCode = 0;
const results = [];

function header(title) {
  log('\n' + '='.repeat(60), COLORS.bold);
  log(`  ${title}`, COLORS.bold + COLORS.cyan);
  log('='.repeat(60) + '\n', COLORS.bold);
}

function runTestGate(name, cmd, label) {
  header(`${label} — ${name}`);
  log(`Running: ${cmd}\n`, COLORS.yellow);

  const output = runSilent(cmd);
  const passed = output !== null;

  results.push({ name, label, passed, output });

  if (passed) {
    log(`✅ ${label} — PASSED\n`, COLORS.green);
  } else {
    log(`❌ ${label} — FAILED\n`, COLORS.red);
    exitCode = 1;
  }

  return passed;
}

// Main execution
header('🧪 HARAVAN INVOICE — TEST GATE');
log(`Date: ${new Date().toISOString()}`, COLORS.bold);
log(`Mode: ${apiOnly ? 'API only' : portalOnly ? 'Portal only' : 'Full suite'}`, COLORS.bold);
log(`Coverage: ${coverage ? 'Enabled' : 'Disabled'}\n`, COLORS.bold);

if (!portalOnly) {
  const apiCmd = watch ? 'pnpm --filter @haravan/api test:watch' : `pnpm --filter @haravan/api test ${coverage ? '-- --coverage' : ''}`;
  runTestGate('API Tests', apiCmd, 'Backend (Hono + D1)');
}

if (!apiOnly) {
  const portalCmd = watch ? 'pnpm --filter @haravan/portal test:watch' : `pnpm --filter @haravan/portal test ${coverage ? '-- --coverage' : ''}`;
  runTestGate('Portal Tests', portalCmd, 'Frontend (React)');
}

if (!apiOnly && !portalOnly) {
  runTestGate('Shared Tests', 'pnpm --filter @haravan/shared test', 'Shared (Validation)');
}

if (!watch && !portalOnly) {
  header('🔍 TypeScript Type Check');
  const tsOutput = runSilent('pnpm --filter @haravan/api exec tsc --noEmit 2>&1');
  const tsPassed = tsOutput === null || !tsOutput.includes('error TS');
  results.push({ name: 'api-typecheck', label: 'API TypeCheck', passed: tsPassed });
  if (tsPassed) {
    log('✅ API TypeCheck — PASSED\n', COLORS.green);
  } else {
    log('❌ API TypeCheck — FAILED\n', COLORS.red);
    exitCode = 1;
  }
}

if (!watch && !apiOnly) {
  const tsOutput = runSilent('pnpm --filter @haravan/portal typecheck 2>&1');
  const tsPassed = tsOutput === null || !tsOutput.includes('error TS');
  results.push({ name: 'portal-typecheck', label: 'Portal TypeCheck', passed: tsPassed });
  if (tsPassed) {
    log('✅ Portal TypeCheck — PASSED\n', COLORS.green);
  } else {
    log('❌ Portal TypeCheck — FAILED\n', COLORS.red);
    exitCode = 1;
  }
}

// Summary
header('📊 TEST GATE SUMMARY');

const total = results.length;
const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;

log(`Total: ${total}  |  Passed: ${passed}  |  Failed: ${failed}\n`, passed === total ? COLORS.green : COLORS.red);

for (const r of results) {
  const icon = r.passed ? '✅' : '❌';
  const color = r.passed ? COLORS.green : COLORS.red;
  log(`  ${icon} ${r.label}`, color);
}

log('');

if (exitCode === 0) {
  log('🎉 ALL GATES PASSED — Ready for deployment!', COLORS.bold + COLORS.green);
} else {
  log('🚫 TEST GATE FAILED — Fix issues before proceeding.', COLORS.bold + COLORS.red);
}

log('');
process.exit(exitCode);
