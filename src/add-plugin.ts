import { blue } from '../deps.ts';
/** Add import and files for the provided plugin in the provided directory. */
export default function addPlugin(directory: string, name: string): void {
  console.log(`${blue('>')} Adding plugin: ${blue(name)}...`);
  // Do fs stuff
  console.log(`${blue('>')} Added plugin: ${blue(name)}!`);
}