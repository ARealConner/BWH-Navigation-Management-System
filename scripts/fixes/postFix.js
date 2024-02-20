/* eslint-env node */
import { spawn } from 'child_process';
import { isDockerRunning } from './dockerFixes.js';

function executePostFix () {
  // Yes, the two yarn install commands are intentional. I am not sure why, but the first one does not always work.
  const commands = ['yarn cache clean', 'yarn install', 'yarn build:dev', 'yarn install'];

  let i = 0;
  const next = () => {
    if (i < commands.length) {
      const [cmd, ...args] = commands[i++].split(' ');
      const proc = spawn(cmd, args, { shell: true, stdio: 'inherit' });
      proc.on('exit', next);
    } else {
      if (!process.argv.includes('docker') && !isDockerRunning()) {
        console.error('\x1b[31m\x1b[1m%s\x1b[0m', 'Warning: Docker was not running. Docker-related fixes were not applied. If your issue was not related to Docker, then you can safely ignore this. Otherwise, start Docker, then run the command again.');
      }
      console.warn(
        '\x1b[33m%s\x1b[0m',
        `Notice: ESLint path errors may arise after clearing cache and node_modules. 
         WebStorm is designed to auto-resolve this, but it may take some time.
         You may have to rerun \`yarn install\`
         If the issue persists, try the following: 
             - Rerun \`yarn install\` and restart WebStorm, or if the issue persists,
             - Navigate to \`File -> Invalidate Caches...\`, then select \`Invalidate Caches and Restart\`.
         These steps are optional; the issue typically resolves on its own.`
      );
    }
  };

  next();
}

export { executePostFix };
