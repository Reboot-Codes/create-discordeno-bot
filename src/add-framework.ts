import { blue } from '../deps.ts';

export default function addFramework(directory: string, framework: string): void {
  console.log(`${blue('>')} Adding files for the ${framework} framework...`);
  // Do fs stuff...
  console.log(`${blue('>')} Added files for the ${framework} framework!`);
}