import { blue, ensureDir, exists, red, TerminalSpinner } from "../deps.ts";

export default async function addBase(
  directory: string,
  botType: string,
  token?: string,
) {
  const spinner = new TerminalSpinner("Adding Base files...");
  const encoder = new TextEncoder();
  spinner.start();

  // Create project directory
  const dirExists = await exists(directory);
  if (dirExists) {
    spinner.fail("Failed to add base files!");
    console.log(
      `${red("!")} We can't add files to ${
        blue(directory)
      } because that directory already exists!`,
    );
    Deno.exit(1);
  }
  await ensureDir(directory).catch((err) => {
    spinner.fail("Failed to add base files!");
    console.log(
      `${red("!")} We can't create ${blue(directory)}! Error:\n${err}`,
    );
    Deno.exit(1);
  });

  // Add base bot files
  if (botType == "gateway") {
    // Add base files for a gateway bot

    // Create `deps.ts`
    await Deno.writeFile(
      `${directory}/deps.ts`,
      encoder.encode(
        `export * from 'https://deno.land/x/discordeno@13.0.0-rc35/mod.ts';\nexport { config as dotEnvConfig } from "https://deno.land/x/dotenv@v3.1.0/mod.ts";\nexport * from "https://deno.land/std@0.117.0/fmt/colors.ts";\n`,
      ),
    ).catch((err) => {
      spinner.fail("Failed to add base files!");
      console.log(
        `${red("!")} Write file error: Could not write ${blue("deps.ts")} to ${
          blue(directory)
        }! Error:\n${err}`,
      );
      Deno.exit(1);
    });

    // Create `config.ts`
    await Deno.writeFile(
      `${directory}/config.ts`,
      encoder.encode(
        `import { dotEnvConfig } from './deps.ts';\ndotEnvConfig({ export: true });\nexport const BOT_TOKEN = Deno.env.get("BOT_TOKEN") || "";\nexport const BOT_ID = BigInt(atob(BOT_TOKEN.split(".")[0]));\n`,
      ),
    ).catch((err) => {
      spinner.fail("Failed to add base files!");
      console.log(
        `${red("!")} Write file error: Could not write ${
          blue("config.ts")
        } to ${blue(directory)}! Error:\n${err}`,
      );
      Deno.exit(1);
    });

    // Create `mod.ts`
    await Deno.writeFile(
      `${directory}/mod.ts`,
      encoder.encode(
        `import { ActivityTypes, createBot, startBot } from './deps.ts';\nimport { BOT_ID, BOT_TOKEN } from "./config.ts";\nimport { logger } from "./src/utils/logger.ts";\n\nconst log = logger({ name: "Main" });\n\nlog.info("Starting Bot, this might take a while...");\n\nexport const bot = createBot({\n  token: BOT_TOKEN,\n  botId: BOT_ID,\n  intents: [],\n  events: {}\n});\n\nbot.gateway.presence = {\n  status: "online",\n  activities: [\n    {\n      name: "Discordeno is Best Lib",\n      type: ActivityTypes.Game,\n      createdAt: Date.now(),\n    }\n  ]\n};\n\nawait startBot(bot);\n`,
      ),
    ).catch((err) => {
      spinner.fail("Failed to add base files!");
      console.log(
        `${red("!")} Write file error: Could not write ${blue("mod.ts")} to ${
          blue(directory)
        }! Error:\n${err}`,
      );
      Deno.exit(1);
    });

    // Create `src`
    await ensureDir(`${directory}/src`).catch((err) => {
      spinner.fail("Failed to add base files!");
      console.log(
        `${red("!")} We can't create ${
          blue(`${directory}/src`)
        }! Error:\n${err}`,
      );
      Deno.exit(1);
    });

    // Create `src/utils`
    await ensureDir(`${directory}/src/utils`).catch((err) => {
      spinner.fail("Failed to add base files!");
      console.log(
        `${red("!")} We can't create ${
          blue(`${directory}/src/utils`)
        }! Error:\n${err}`,
      );
      Deno.exit(1);
    });

    // Create `src/utils/logger.ts`
    await Deno.writeFile(
      `${directory}/src/utils/logger.ts`,
      encoder.encode(
        "// deno-lint-ignore-file no-explicit-any\nimport { bold, cyan, gray, italic, red, yellow } from '../../deps.ts';\n\nexport enum LogLevels {\n  Debug,\n  Info,\n  Warn,\n  Error,\n  Fatal,\n}\n\nconst prefixes = new Map<LogLevels, string>([\n  [LogLevels.Debug, 'DEBUG'],\n  [LogLevels.Info, 'INFO'],\n  [LogLevels.Warn, 'WARN'],\n  [LogLevels.Error, 'ERROR'],\n  [LogLevels.Fatal, 'FATAL'],\n]);\n\nconst noColor: (str: string) => string = (msg) => msg;\nconst colorFunctions = new Map<LogLevels, (str: string) => string>([\n  [LogLevels.Debug, gray],\n  [LogLevels.Info, cyan],\n  [LogLevels.Warn, yellow],\n  [LogLevels.Error, (str: string) => red(str)],\n  [LogLevels.Fatal, (str: string) => red(bold(italic(str)))],\n]);\n\nexport function logger({\n  logLevel = LogLevels.Info,\n  name,\n}: {\n  logLevel?: LogLevels;\n  name?: string;\n} = {}) {\n  function log(level: LogLevels, ...args: any[]) {\n    if (level < logLevel) return;\n\n    let color = colorFunctions.get(level);\n    if (!color) color = noColor;\n\n    const date = new Date();\n    const log = [\n      `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`,\n      color(prefixes.get(level) || 'DEBUG'),\n      name ? `${name} >` : '>',\n      ...args,\n    ];\n\n    switch (level) {\n      case LogLevels.Debug:\n        return console.debug(...log);\n      case LogLevels.Info:\n        return console.info(...log);\n      case LogLevels.Warn:\n        return console.warn(...log);\n      case LogLevels.Error:\n        return console.error(...log);\n      case LogLevels.Fatal:\n        return console.error(...log);\n      default:\n        return console.log(...log);\n    }\n  }\n\n  function setLevel(level: LogLevels) {\n    logLevel = level;\n  }\n\n  function debug(...args: any[]) {\n    log(LogLevels.Debug, ...args);\n  }\n\n  function info(...args: any[]) {\n    log(LogLevels.Info, ...args);\n  }\n\n  function warn(...args: any[]) {\n    log(LogLevels.Warn, ...args);\n  }\n\n  function error(...args: any[]) {\n    log(LogLevels.Error, ...args);\n  }\n\n  function fatal(...args: any[]) {\n    log(LogLevels.Fatal, ...args);\n  }\n\n  return {\n    log,\n    setLevel,\n    debug,\n    info,\n    warn,\n    error,\n    fatal,\n  };\n}\n\nexport const log = logger();\n",
      ),
    ).catch((err) => {
      spinner.fail("Failed to add base files!");
      console.log(
        `${red("!")} Write file error: Could not write ${
          blue("logger.ts")
        } to ${blue(`${directory}/src/utils`)}! Error:\n${err}`,
      );
      Deno.exit(1);
    });
  } else if (botType == "http") {
    // Add base files for a http bot
  } else {
    // Just in case, but this won't happen 99.99% of the time
    spinner.fail("Failed to add base files!");
    console.log(`${red("!")} Internal Error: ${botType} is invalid!`);
    Deno.exit(1);
  }

  // Add token to .env
  await Deno.writeFile(
    `./${directory}/.env`,
    encoder.encode(`BOT_TOKEN="${token}"\n`),
  )
    .catch((err) => {
      spinner.fail("Failed to add base files!");
      console.log(
        `${red("!")} Write file error: Could not write ${
          blue(".env")
        } to ${directory}! Error:\n${err}`,
      );
      Deno.exit(1);
    });
  // Add .gitignore
  await Deno.writeFile(`./${directory}/.gitignore`, encoder.encode(`.env\n`))
    .catch((err) => {
      spinner.fail("Failed to add base files!");
      console.log(
        `${red("!")} Write file error: Could not write ${
          blue(".gitignore")
        } to ${directory}! Error:\n${err}`,
      );
      Deno.exit(1);
    });

  spinner.succeed("Added base files!");
}
