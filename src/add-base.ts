import { blue } from '../deps.ts';

export default function addBase(directory: string, botType: string, token?: string): void {
  console.log(`${blue('>')} Adding base files...`);
  // Do fs stuff...
  console.log(`${blue('>')} Added base files!`);
}
