import { Command, blue, red, gray, yellow, Select, Input, Secret, Checkbox, Confirm } from "./deps.ts";
import addBase from './src/add-base.ts';
import addFramework from './src/add-framework.ts';
import addPlugin from './src/add-plugin.ts';
import initGit from './src/init-git.ts';

// Stolen from https://github.com/discordeno/discordeno/blob/main/template/minimal/src/utils/helpers.ts
function humanizeMilliseconds(milliseconds: number) {
  // Gets ms into seconds
  const time = milliseconds / 1000;
  if (time < 1) return "1s";

  const days = Math.floor(time / 86400);
  const hours = Math.floor((time % 86400) / 3600);
  const minutes = Math.floor(((time % 86400) % 3600) / 60);
  const seconds = Math.floor(((time % 86400) % 3600) % 60);

  const dayString = days ? `${days}d ` : "";
  const hourString = hours ? `${hours}h ` : "";
  const minuteString = minutes ? `${minutes}m ` : "";
  const secondString = seconds ? `${seconds}s ` : "";

  return `${dayString}${hourString}${minuteString}${secondString}`.trim();
}

await new Command()
  .name("create-discordeno-bot")
  .version("1.0.0")
  .description("A quick CLI to create a Discordeno Bot.")
  .action(async () => {
    console.log(`${blue('>')} Hey there 👋, thanks for using discordeno.`);
    console.log(`${yellow('!')} This CLI is WIP, please send bugs to: https://github.com/Reboot-Codes/create-discordeno-bot/issues\n`)

    const botType = await Select.prompt({
      indent: "",
      listPointer: blue(">"),
      pointer: blue(">"),
      message: "What type of bot do you want to create?",
      options: [
        { name: "Gateway Bot", value: "gateway" },
        { name: "HTTP Bot", value: "http" }
      ]
    });

    const approach = await Select.prompt({
      indent: "",
      listPointer: blue(">"),
      pointer: blue(">"),
      message: "Do you prefer a functional or Object-Oriented approach?",
      options: [
        { name: "Functional", value: "functional"},
        { name: "Object-Oriented", value: "oop" }
      ]
    });

    let framework = "none";
    if (approach == "oop") {
      framework = await Select.prompt({
        indent: "",
        listPointer: blue(">"),
        pointer: blue(">"),
        message: "Which Object-Oriented framework would you like to use?",
        options: [
          { name: "Natico", value: "natico" },
          { name: "Amethyst", value: "amethyst" }
        ]
      });
    }

    let plugins: string[] = [];
    if (framework == "none") {
      plugins = await Checkbox.prompt({
        indent: "",
        listPointer: blue(">"),
        pointer: blue(">"),
        message: "What plugins would you like to use?",
        searchLabel: blue(">"),
        options: [
          { name: "Cache Plugin", value: "cache" },
          { name: "Fileloader Plugin", value: "fileloader" },
          { name: "Permissions Plugin", value: "permissions" },
          { name: "Helpers Plugin", value: "helpers" }
        ]
      });
    }

    console.log(`\n${blue('>')} Okay, we're going to create a ${blue(botType)} bot.\n${blue('>')} ${
      framework == "none" ? 
        (
          (
            plugins.length > 0 ? 
            (`With the ${plugins.length > 1 ? `following plugins: ${blue(plugins.join(', '))}` : `${blue(plugins[0])} plugin.`}`) : 
            `Without any discordeno plugins.`
          )
        ) : `With the ${blue(framework)} framework.`}\n`);

    const denoVersion = Deno.version.deno;
    if (!(Number(denoVersion.split('.')[0]) >= 1)) {
      console.log(`${red('!')} The version of deno you have installed (v${denoVersion}) is too old!\n${red('!')} Please upgrade to a version at or greater than v1`);
      Deno.exit(1);
    }
    console.log(`${blue('>')} You have ${blue(`deno v${denoVersion}`)} installed, great!\n`);

    const botName = await Input.prompt({
      indent: "",
      listPointer: blue(">"),
      pointer: blue(">"),
      message: `What would you like to call your bot? ${gray('(e.g. "Awesome Bot")')}`,
      minLength: 3
    });

    const botToken = await Secret.prompt({
      indent: "",
      pointer: blue(">"),
      message: "What is your bot's API token?"
    });

    const projectDir = await Input.prompt({
      indent: "",
      listPointer: blue(">"),
      pointer: blue(">"),
      message: "Where would you like to initialize the bot?",
      default: `./${botName.toLowerCase().split(" ").join("-")}`
    });

    const initializeGit = await Confirm.prompt({
      indent: "",
      pointer: blue(">"),
      message: "Would you like to initialize a git repository?",
      default: true
    });

    console.log(`\n${blue('>')} Amazing! Creating a bot in ${blue(projectDir)} using ${framework == "none" ? blue(`discordeno v13.0.0-rc35`) : blue(framework)}...\n`);

    const startTime = performance.now();
    if (framework == "none") { 
      // Framework-less Setup Steps
      await addBase(projectDir, botType, (botToken == "" ? undefined : botToken));
      if (plugins.length > 0) { 
        for (const plugin of plugins) {
          await addPlugin(projectDir, plugin);
        }
      }
    } else {
      // Framework Setup, they require different setup steps.
      await addFramework(projectDir, framework)
    }
    // Although git init is the same for either Functional or OOP
    if (initializeGit) { await initGit(projectDir) }
    const endTime = performance.now();

    console.log(`\n${blue('>')} Created ${blue(botName)} in ${blue(projectDir)}, took ${blue(humanizeMilliseconds(endTime - startTime))}.`);
  })
  .parse(Deno.args);
