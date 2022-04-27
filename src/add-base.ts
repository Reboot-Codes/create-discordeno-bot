import { red, TerminalSpinner, exists, ensureDir  } from '../deps.ts';

export default async function addBase(directory: string, botType: string, token?: string) {
  const spinner = new TerminalSpinner('Adding Base files...');
  spinner.start();
  
  // Create project directory
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

  // Add base bot files
  if (botType == 'gateway') {
    // Add base files for a gateway bot
  } else if (botType == 'http') {
    // Add base files for a http bot
  } else {
    // Just in case, but this won't happen 99.99% of the time
    spinner.fail('Failed to add base files!');
    console.log(`${red('!')} Internal Error: ${botType} is invalid!`);
    Deno.exit(1);
  }

  const encoder = new TextEncoder();
  // Add token to .env
  await Deno.writeFile(`./${directory}/.env`, encoder.encode(`BOT_TOKEN="${token}"\n`))
    .catch((err) => {
      spinner.fail('Failed to add base files!');
      console.log(`${red('!')} Write file error: Could not write .env to ${directory}! Error:\n${err}`);
      Deno.exit(1);
    });
  // Add .gitignore
  await Deno.writeFile(`./${directory}/.gitignore`, encoder.encode(`.env\n`))
    .catch((err) => {
      spinner.fail('Failed to add base files!');
      console.log(`${red('!')} Write file error: Could not write .gitignore to ${directory}! Error:\n${err}`);
      Deno.exit(1);
    });
  
  spinner.succeed('Added base files!');
}
