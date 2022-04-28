import { emptyDir, red, TerminalSpinner } from "../deps.ts";
/** Deletes the given directory. */
export default async function fullCleanUp(directory: string) {
  const realDir = await Deno.realPath(directory);
  const spinner = new TerminalSpinner("Cleaning Up...");
  spinner.start();

  await emptyDir(realDir).catch((err) => {
    spinner.fail("Failed to clean up!");
    console.log(
      `${red("!")} Could not empty directory ${directory}! Error:\n${err}`,
    );
    Deno.exit(1);
  });
  await Deno.remove(realDir).catch((err) => {
    spinner.fail("Failed to clean up!");
    console.log(`${red("!")} Could not delete ${directory}! Error:\n${err}`);
    Deno.exit(1);
  });

  spinner.succeed("Finished cleaning up!");
}
