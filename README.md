# NodeDev

A simple Node.js tool that lets you interactively select and run `npm` scripts from your project's `package.json` in **separate terminal windows**.

## Features

- Lists all scripts in your `package.json`
- Lets you choose scripts to run via terminal prompt
- Runs each script in its own terminal window
- Automatically closes the terminal after the script finishes
- Keeps the main terminal window open
- Cross-platform support (Windows, macOS, Linux)

## Usage

1. **Place the script** `nodedev.js` in your project root (where `package.json` lives).

2. **Run the script**:

   ```bash
   node nodedev.js
