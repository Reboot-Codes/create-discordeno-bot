import { red, TerminalSpinner, exists } from '../deps.ts';

export default async function addFramework(directory: string, framework: string) {
  const spinner = new TerminalSpinner(`Adding ${framework} files...`);
  spinner.start();
  
  // Check if the project directory exists
  const directoryExists = await exists(directory);
  if (!directoryExists) {
    spinner.fail('Failed to initialize the Git repository!');
    console.log(`${red('!')} We can't create a git repo in ${directory} because it doesn't exist!\n${red('!')} Weird, as this step is run after creating the project directory.\n${red('!')} Make a bug report at https://github.com/Reboot-Codes/create-discordeno-bot/issues`);
    Deno.exit(1);
  }

  spinner.succeed(`Added ${framework} files!`);
}