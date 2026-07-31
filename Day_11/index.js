/**
 * index.js — Day 11 practical task
 * -----------------------------------------------------------------------
 * Goals covered:
 *   - Using an installed npm package (chalk) in a real script
 *   - Node's built-in modules (os, process) alongside a third-party one
 *   - CommonJS module system (require / module.exports)
 * -----------------------------------------------------------------------
 */

const chalk = require("chalk");
const os = require("os");

function printBanner() {
  console.log(chalk.bgBlue.white.bold("\n PETALNEX — MERN STACK INTERNSHIP \n"));
  console.log(chalk.cyan("Day 11 — Node.js, npm & the Git/GitHub Workflow\n"));
}

function printEnvironmentInfo() {
  console.log(chalk.yellow("Environment info:"));
  console.log(`  Node version   : ${chalk.green(process.version)}`);
  console.log(`  Platform       : ${chalk.green(os.platform())} (${os.type()})`);
  console.log(`  CPU cores      : ${chalk.green(os.cpus().length)}`);
  console.log(`  Home directory : ${chalk.green(os.homedir())}`);
  console.log(`  Working dir    : ${chalk.green(process.cwd())}`);
}

function printSuccessMessage() {
  console.log(chalk.green.bold("\n✔ npm package installed and imported successfully.\n"));
}

function main() {
  printBanner();
  printEnvironmentInfo();
  printSuccessMessage();
}

main();
