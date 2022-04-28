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

  if (framework == "natico") {
    // Add `natico` framework files
  } else if (framework == "amethyst") {
    // Add `amethyst` framework files
  } else if (framework == "oasis") {
    // Add `oasis` framework files
  } else {
    spinner.fail(`Failed to add ${framework} files!`);
    console.log(`${red('!')} We can't add ${blue(framework)} files, because we don't have a template for that!\n${red('!')} Weird, since this shouldn't happen. Make a bug report at: https://github.com/Reboot-Codes/create-discordeno-bot/issues`);
    Deno.exit(1);
  }

  spinner.succeed(`Added ${framework} files!`);
}