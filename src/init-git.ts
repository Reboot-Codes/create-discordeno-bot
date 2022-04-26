import { TerminalSpinner } from '../deps.ts';
import { sleep } from "https://x.nest.land/sleep@1.0.0/mod.ts";

export default async function initGit(directory: string) {
  const spinner = new TerminalSpinner('Initializing the Git repository...');
  spinner.start();
  
  await sleep(3); // In place of fs stuff

  spinner.succeed('Initialized the Git repository!');
}
