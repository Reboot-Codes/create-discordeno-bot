import { red, TerminalSpinner, exists } from '../deps.ts';

/** Add import and files for the provided plugin in the provided directory. */
export default async function addPlugin(directory: string, name: string) {
  const spinner = new TerminalSpinner(`Adding the ${name} plugin...`);
  spinner.start();

  // Check if the project directory exists
  const directoryExists = await exists(directory);
  if (!directoryExists) {
    spinner.fail(`Failed to add the ${name} plugin!`);
    console.log(`${red('!')} Weird, as this step is run after creating the project directory.\n${red('!')} Make a bug report at https://github.com/Reboot-Codes/create-discordeno-bot/issues`);
    Deno.exit(1);
  }

  spinner.succeed(`Added the ${name} plugin!`);
}