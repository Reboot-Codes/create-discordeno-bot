import { red, TerminalSpinner, exists, ensureDir  } from '../deps.ts';

export default async function addBase(directory: string, botType: string, token?: string) {
  const spinner = new TerminalSpinner('Adding Base files...');
  spinner.start();
  
  const dirExists = await exists(directory);
  if (dirExists) {
    spinner.fail('Failed to add base files!');
    console.log(`${red('!')} We can't add files to ${directory} because that directory already exists!`);
    Deno.exit(1);
  }
  await ensureDir(directory).catch((err) => {
    spinner.fail('Failed to add base files!');
    console.log(`${red('!')} We can't create ${directory}! Error:\n${err}`);
    Deno.exit(1);
  });



  spinner.succeed('Added base files!');
}
