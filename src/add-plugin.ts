import { TerminalSpinner } from '../deps.ts';
import { sleep } from "https://x.nest.land/sleep@1.0.0/mod.ts";

/** Add import and files for the provided plugin in the provided directory. */
export default async function addPlugin(directory: string, name: string) {
  const spinner = new TerminalSpinner(`Adding the ${name} plugin...`);
  spinner.start();

  await sleep(3); // In place of fs stuff

  spinner.succeed();
}