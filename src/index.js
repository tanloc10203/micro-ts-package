#!/usr/bin/env node

const { Command } = require("commander");
const inquirer = require("inquirer");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const { spawn } = require("child_process");

const program = new Command();

program
  .name("create-node-ts")
  .description("CLI to generate TypeScript node projects")
  .version("1.0.0");

program
  .argument("[project-name]", "name of the project")
  .option("-y, --yes", "skip prompts and use defaults")
  .option("--skip-install", "skip npm install")
  .action(async (projectName, options) => {
    try {
      const config = await getProjectConfig(projectName, options.yes);
      await generateProject(config);
      
      if (!options.skipInstall) {
        await installDependencies(config.projectName);
        // Copy .env.example to .env.development after installing dependencies
        await copyEnvFile(config.projectName);
      }
      
      console.log(chalk.green(`✅ Project ${config.projectName} created successfully!`));
      console.log(chalk.blue(`📁 cd ${config.projectName}`));
      
      if (options.skipInstall) {
        console.log(chalk.blue(`📦 npm install`));
        console.log(chalk.blue(`📄 Copy .env.example to .env.development`));
      }
      
      console.log(chalk.blue(`🚀 npm run dev`));
    } catch (error) {
      console.error(chalk.red("❌ Error creating project:"), error);
      process.exit(1);
    }
  });

async function getProjectConfig(projectName, skipPrompts = false) {
  if (skipPrompts && projectName) {
    return {
      projectName,
      serviceName: toPascalCase(projectName),
      port: 3000,
      dbName: projectName,
      author: "Developer",
    };
  }

  const answers = await inquirer.default.prompt([
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
      default: (answers) => toPascalCase(answers.projectName),
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
      default: (answers) => answers.projectName,
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

async function generateProject(config) {
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

async function processTemplateFiles(projectDir, config) {
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

async function installDependencies(projectName) {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue("📦 Installing dependencies..."));
    
    const projectDir = path.join(process.cwd(), projectName);
    const npmProcess = spawn("npm", ["install"], {
      cwd: projectDir,
      stdio: "inherit",
      shell: true,
    });

    npmProcess.on("close", (code) => {
      if (code === 0) {
        console.log(chalk.green("✅ Dependencies installed successfully!"));
        resolve();
      } else {
        reject(new Error(`npm install failed with exit code ${code}`));
      }
    });

    npmProcess.on("error", (error) => {
      reject(new Error(`Failed to start npm install: ${error.message}`));
    });
  });
}

async function copyEnvFile(projectName) {
  try {
    const projectDir = path.join(process.cwd(), projectName);
    const envExamplePath = path.join(projectDir, ".env.example");
    const envDevPath = path.join(projectDir, ".env.development");

    // Check if .env.example exists
    if (await fs.pathExists(envExamplePath)) {
      console.log(chalk.blue("📄 Copying .env.example to .env.development..."));
      await fs.copy(envExamplePath, envDevPath);
      console.log(chalk.green("✅ Environment file copied successfully!"));
    } else {
      console.log(chalk.yellow("⚠️  .env.example not found, skipping env file copy"));
    }
  } catch (error) {
    console.error(chalk.red("❌ Error copying environment file:"), error.message);
    // Don't throw error, just log warning as this is not critical
  }
}

function toPascalCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

program.parse();