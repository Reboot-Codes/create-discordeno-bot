import { red, blue, TerminalSpinner, exists, ensureDir } from '../deps.ts';

export default async function addFramework(directory: string, framework: string) {
  const spinner = new TerminalSpinner(`Adding ${framework} files...`);
  spinner.start();
  
  // Create project directory
  const dirExists = await exists(directory);
  if (dirExists) {
    spinner.fail(`Failed to add ${framework} files!`);
    console.log(`${red('!')} We can't add files to ${blue(directory)} because that directory already exists!`);
    Deno.exit(1);
  }
  await ensureDir(directory).catch((err) => {
    spinner.fail(`Failed to add ${framework} files!`);
    console.log(`${red('!')} We can't create ${blue(directory)}! Error:\n${err}`);
    Deno.exit(1);
  });

  spinner.succeed(`Added ${framework} files!`);
}