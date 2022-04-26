import { TerminalSpinner } from '../deps.ts';
import { sleep } from "https://x.nest.land/sleep@1.0.0/mod.ts";

export default async function addBase(directory: string, botType: string, token?: string) {
  const spinner = new TerminalSpinner('Adding Base files...');
  spinner.start();
  
  await sleep(3); // In place of fs stuff

  spinner.succeed('Added base files!');
}
