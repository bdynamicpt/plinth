import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

/**
 * PostToolUse hook: after an agent edits a file, Prettier formats it and, for component CSS,
 * Stylelint fixes what it can. What is left is printed and the hook exits 2, which hands the
 * message back to the agent so it fixes the rule break straight away.
 *
 * Reads the hook's JSON from stdin ({"tool_input": {"file_path": "..."}}).
 */
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const input = JSON.parse(readFileSync(0, 'utf8')) as { tool_input?: { file_path?: string } };
const file = input.tool_input?.file_path;

if (!file) {
  process.exit(0);
}

const path = relative(root, resolve(root, file));
if (path.startsWith('..')) {
  process.exit(0);
}

const bin = (name: string) => resolve(root, 'node_modules/.bin', name);
const problems: string[] = [];

function run(command: string, args: string[]) {
  try {
    execFileSync(command, args, { cwd: root, encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    const { stdout, stderr } = error as { stdout?: string; stderr?: string };
    problems.push([stdout, stderr].filter(Boolean).join('\n').trim());
  }
}

// Respects .prettierignore; skips files Prettier has no parser for (such as PHP).
run(bin('prettier'), ['--write', '--ignore-unknown', '--log-level', 'warn', path]);

// stylelint.config.js holds the component rules, so it applies to the component CSS only.
if (/^packages\/css\/src\/.+\.css$/.test(path)) {
  run(bin('stylelint'), ['--fix', '--formatter', 'compact', path]);
}

if (problems.length > 0) {
  console.error(`Lint problems in ${path}:\n${problems.join('\n')}`);
  process.exit(2);
}
