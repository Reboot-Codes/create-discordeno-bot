import { red, yellow, TerminalSpinner, exec, OutputMode, exists } from '../deps.ts';

export default async function initGit(directory: string) {
  const spinner = new TerminalSpinner('Initializing the Git repository...');
  spinner.start();
  
  // Check if git is available
  const gitVersion = await exec('git --version', { output: OutputMode.Capture });
  if (!(gitVersion.output.includes('git version'))) {
    spinner.fail('Failed to initialize the Git repository!');
    console.log(`${yellow('!')} Could not find the git executable!\n${yellow('!')} This is not fatal, as this doesn't affect bot operation.`);
    return;
  }

  // Check if the project directory exists
  const directoryExists = await exists(directory);
  if (!directoryExists) {
    spinner.fail('Failed to initialize the Git repository!');
    console.log(`${red('!')} We can't create a git repo in ${directory} because it doesn't exist!\n${red('!')} Weird, as this step is run after creating the project directory.\n${red('!')} Make a bug report at https://github.com/Reboot-Codes/create-discordeno-bot/issues`);
    Deno.exit(1);
  }

  // Initialize the git repository
  await exec(`git init ./${directory}`, { output: OutputMode.Capture })
    .catch((err) => {
      spinner.fail('Failed to initialize the Git repository!');
      console.log(`${yellow('!')} We can't create a git repo in ${directory}!\n${yellow('!')} This is not fatal, as this doesn't affect bot operation. Error:\n${err}`);
      return;
    });

  spinner.succeed('Initialized the Git repository!');
}
