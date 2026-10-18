/**
 * Serves storybook-static on a free port and runs the Storybook test runner against it.
 *
 * A fixed port collides when two checkouts (or two agents in separate worktrees) test at the
 * same time, and a crashed run can leave its server holding the port. Here the system picks the
 * port, and the server always stops when the run ends. Extra arguments go to test-storybook.
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import type { AddressInfo } from 'node:net';

const require = createRequire(import.meta.url);
const { createServer } = require('http-server') as {
  createServer: (options: { root: string; cache: number; silent: boolean }) => {
    server: import('node:http').Server;
  };
};

const { server } = createServer({ root: 'storybook-static', cache: -1, silent: true });
await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address() as AddressInfo;

const runner = spawn(
  'npx',
  ['test-storybook', '--url', `http://127.0.0.1:${port}`, ...process.argv.slice(2)],
  { stdio: 'inherit' },
);
const stop = () => runner.kill('SIGTERM');
process.on('SIGINT', stop);
process.on('SIGTERM', stop);

const code = await new Promise<number>((resolve) => runner.on('exit', (c) => resolve(c ?? 1)));
server.close();
process.exit(code);
