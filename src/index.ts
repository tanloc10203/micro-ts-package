#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

const program = new Command();

interface ProjectConfig {
  projectName: string;
  serviceName: string;
  port: number;
  dbName: string;
  author: string;
}

program
  .name("create-node-ts")
  .description("CLI to generate TypeScript node projects")
  .version("1.0.0");

program
  .argument("[project-name]", "name of the project")
  .option("-y, --yes", "skip prompts and use defaults")
  .action(async (projectName, options) => {
    try {
      const config = await getProjectConfig(projectName, options.yes);
      await generateProject(config);
      console.log(chalk.green(`✅ Project ${config.projectName} created successfully!`));
      console.log(chalk.blue(`📁 cd ${config.projectName}`));
      console.log(chalk.blue(`📦 npm install`));
      console.log(chalk.blue(`🚀 npm run dev`));
    } catch (error) {
      console.error(chalk.red("❌ Error creating project:"), error);
      process.exit(1);
    }
  });

async function getProjectConfig(projectName?: string, skipPrompts = false): Promise<ProjectConfig> {
  if (skipPrompts && projectName) {
    return {
      projectName,
      serviceName: toPascalCase(projectName),
      port: 3000,
      dbName: projectName,
      author: "Developer",
    };
  }

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Project name:",
      default: projectName || "app-service",
      validate: (input) => input.trim() !== "" || "Project name is required",
    },
    {
      type: "input",
      name: "serviceName",
      message: "Service name (PascalCase):",
      default: (answers: ProjectConfig) => toPascalCase(answers.projectName),
      validate: (input) => input.trim() !== "" || "Service name is required",
    },
    {
      type: "number",
      name: "port",
      message: "Port number:",
      default: 3000,
    },
    {
      type: "input",
      name: "dbName",
      message: "Database name:",
      default: (answers: ProjectConfig) => answers.projectName,
    },
    {
      type: "input",
      name: "author",
      message: "Author name:",
      default: "Developer",
    },
  ]);

  return answers;
}

async function generateProject(config: ProjectConfig) {
  const templateDir = path.join(__dirname, "..", "templates");
  const targetDir = path.join(process.cwd(), config.projectName);

  // Check if directory already exists
  if (await fs.pathExists(targetDir)) {
    throw new Error(`Directory ${config.projectName} already exists`);
  }

  console.log(chalk.blue(`📁 Creating project directory: ${config.projectName}`));
  await fs.ensureDir(targetDir);

  // Copy template files
  console.log(chalk.blue("📋 Copying template files..."));
  await fs.copy(templateDir, targetDir);

  // Process template files
  console.log(chalk.blue("🔧 Processing template files..."));
  await processTemplateFiles(targetDir, config);

  console.log(chalk.blue("✨ Project generation completed!"));
}

async function processTemplateFiles(projectDir: string, config: ProjectConfig) {
  const filesToProcess = ["package.json", ".env.example", ".env.development"];

  for (const file of filesToProcess) {
    const filePath = path.join(projectDir, file);
    if (await fs.pathExists(filePath)) {
      let content = await fs.readFile(filePath, "utf-8");

      // Replace template variables
      content = content
        .replace(/{{PROJECT_NAME}}/g, config.projectName)
        .replace(/{{SERVICE_NAME}}/g, config.serviceName)
        .replace(/{{PORT}}/g, config.port.toString())
        .replace(/{{DB_NAME}}/g, config.dbName)
        .replace(/{{AUTHOR}}/g, config.author);

      await fs.writeFile(filePath, content);
    }
  }
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

program.parse();
