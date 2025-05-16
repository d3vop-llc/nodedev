#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');
const os = require('os');

// Get scripts from package.json
function getScripts() {
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(pkgPath)) {
    console.error('❌ package.json not found in current directory.');
    process.exit(1);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return pkg.scripts || {};
}

// Display interactive selection
function promptSelection(scripts, callback) {
  const scriptNames = Object.keys(scripts).filter(
    (name) => !process.argv.includes(name) // Ignore the command running this script
  );

  if (scriptNames.length === 0) {
    console.log('No scripts found in package.json.');
    process.exit(0);
  }

  console.log('\nAvailable npm scripts:\n');
  scriptNames.forEach((name, i) => {
    console.log(`${i + 1}. ${name} -> ${scripts[name]}`);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('\nSelect script number(s) (comma-separated): ', (answer) => {
    const indices = answer
      .split(',')
      .map((x) => parseInt(x.trim(), 10) - 1)
      .filter((i) => i >= 0 && i < scriptNames.length);

    const selected = indices.map((i) => scriptNames[i]);
    rl.close();
    callback(selected);
  });
}

// Open new terminal window for each command
function runInNewWindow(scriptName) {
  const command = `npm run ${scriptName}`;
  const platform = os.platform();

  let terminalCommand;

  if (platform === 'win32') {
    terminalCommand = `start cmd /c "${command} & pause"`; // Windows CMD
  } else if (platform === 'darwin') {
    terminalCommand = `osascript -e 'tell app "Terminal"
        do script "${command}; exit"
      end tell'`;
  } else {
    terminalCommand = `x-terminal-emulator -e bash -c '${command}; read -p "Press Enter to close..."'`; // Linux with x-terminal-emulator
  }

  exec(terminalCommand, (err) => {
    if (err) {
      console.error(`Failed to run ${scriptName}: ${err.message}`);
    }
  });
}

// Main
const scripts = getScripts();
promptSelection(scripts, (selected) => {
  selected.forEach(runInNewWindow);
});
