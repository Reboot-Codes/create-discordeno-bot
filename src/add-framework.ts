import { TerminalSpinner } from '../deps.ts';
import { sleep } from "https://x.nest.land/sleep@1.0.0/mod.ts";

export default async function addFramework(directory: string, framework: string) {
  const spinner = new TerminalSpinner(`Adding ${framework} files...`);
  spinner.start();
  
  await sleep(3); // In place of fs stuff

  spinner.succeed(`Added ${framework} files!`);
}