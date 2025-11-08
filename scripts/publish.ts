import { spawnSync } from "child_process";
import { platform } from "os";
import packageJSON from "../package.json" with { type: "json" };
import inquirer from "inquirer";
import { writeFileSync } from "fs";
import { resolve } from "path";

const packageJSONPath = resolve(import.meta.dirname, "../package.json");
const backup = JSON.stringify(packageJSON, null, 2);

interface Command {
  bin: string;
  args: string[];
  cmd?: boolean;
  label: string;
}

function run(command: Command) {
  const isWindows = platform() === "win32";
  const bin = isWindows && command.cmd ? `${command.bin}.cmd` : command.bin;

  console.log(`\n>>${command.label}...`);

  const result = spawnSync(bin, command.args, { stdio: "inherit" });

  if (result.error) {
    throw new Error(`Error while executing ${bin}: ${result.error}`);
  }
  if (result.status !== 0) {
    throw new Error(`Command ${bin} exited with code ${result.status}`);
  }

  console.log("Operation completed");
}

async function getNewVersion() {
  const pattern = /^\d+\.\d+\.\d+$/;

  while (true) {
    const { newVersion } = await inquirer.prompt([
      {
        name: "newVersion",
        type: "input",
        message: "Input new version",
      },
    ]);

    if (pattern.test(newVersion)) {
      return newVersion;
    }

    console.log("Invalid version, the correct format is X.Y.Z");
  }
}

async function upgrade(): Promise<string> {
  const segments = packageJSON.version.split(".");
  let major = parseInt(segments[0]);
  let minor = parseInt(segments[1]);
  let patch = parseInt(segments[2]);

  console.log(`Current version: ${packageJSON.version}`);

  const { bump } = await inquirer.prompt([
    {
      name: "bump",
      message: "Select bump",
      type: "select",
      choices: ["Major", "Minor", "Patch", "Custom"],
    },
  ]);

  let newVersion: string;

  switch (bump) {
    case "Major":
      major++;
      minor = 0;
      patch = 0;
      break;
    case "Minor":
      minor++;
      patch = 0;
      break;
    case "Patch":
      patch++;
      break;
    case "Custom":
      newVersion = await getNewVersion();
  }

  newVersion ||= `${major}.${minor}.${patch}`;

  packageJSON.version = newVersion;

  writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2));

  console.log("Package.json updated.");

  return newVersion;
}

async function main() {
  run({
      bin: "npm",
      args: ["run", "build"],
      label: "Building application",
      cmd: true,
  });

  const { deploy } = await inquirer.prompt([
    {
      name: "deploy",
      type: "confirm",
      message: "Deploy to production?",
    },
  ]);

  let defaultMessage: string;

  if (deploy) {
    const newVersion = await upgrade();

    defaultMessage = `release v${newVersion}`;
  }

  const { message } = await inquirer.prompt([
    {
      name: "message",
      type: "input",
      message: "Enter commit message",
      default: defaultMessage!,
    },
  ]);

  const commands: Command[] = [
    {
      bin: "git",
      args: ["add", "."],
      label: "Staging changes",
    },
    {
      bin: "git",
      args: ["commit", "-m", message],
      label: "Commiting changes",
    },
    {
      bin: "git",
      args: ["push", "origin", "main"],
      label: "Pushing changes",
    },
  ];

  if (deploy) {
    commands.push({
      bin: "npm",
      args: ["run", "deploy"],
      label: "Deploying to production",
      cmd: true,
    });
  }

  for (const command of commands) {
    run(command);
  }

  console.log("Changes published successfully");
}

main().catch((e) => {
  console.error("Error while publishing: ", e);

  console.log("Restauring package.json");
  writeFileSync(packageJSONPath, backup);

  process.exit(1);
});
