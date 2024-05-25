const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const SYSTEM_MESSAGE = `You are an AI designed to assist in software development tasks. Your current task is to analyze a set of given file paths, their contents, and a user prompt to generate updates that need to be made to these files.

Your task is to output a list of Changes needed to complete the task. Output format should be following:
On first line if new file is needed write "CREATE_FILE: " and file path; If file update is needed then write "UPDATE_FILE" and file path.
After that you output code in markdown format.
Add divider between files "----------"
`;

const test = async (workingDir, filesJson) => {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyD26mbORxYTvFVkI4bv7b-YxaGkP5_oRVA",
    {
      method: "POST",
      body: JSON.stringify({
        contents: [
          {
            role: "model",
            parts: [
              {
                text: SYSTEM_MESSAGE,
              },
            ],
          },
          {
            role: "user",
            parts: [
              {
                text: `FILES_JSON: ${filesJson}

USER_REQUEST: Add component TestPage which has header, and a component inside which counts button clicks
            `,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    console.error("Bad response", await res.json());
    return;
  }

  const data = await res.json();
  let text = data.candidates[0].content.parts[0].text;

  console.log(text)
};

function scanDirectory(dir, relativePath = "") {
  const result = {};
  const excluded_dirs = [".git", "node_modules"];
  const whitelist = [
    ".ts",
    "js",
    "tsx",
    "jsx",
    ".css",
    ".json",
    ".mjs",
    ".cjs",
  ];
  // Read the contents of the directory
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const itemRelativePath = path.join(relativePath, item);

    // Check if the current item is a directory or a file
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (excluded_dirs.some((dir) => fullPath.includes(dir))) return;
      // Recursively scan the subdirectory
      Object.assign(result, scanDirectory(fullPath, itemRelativePath));
    } else {
      if (!whitelist.some((file) => item.endsWith(file))) return;
      // Read the file content
      const content = fs.readFileSync(fullPath, "utf8");
      result[itemRelativePath] = content;
    }
  });

  return result;
}

(async () => {
  
  const dir = scanDirectory("/github/workspace");
  console.log(`files choosen:`, Object.keys(dir))
  const data = await test("/github/workspace", JSON.stringify(dir));

  // for (let i = 0; i < data.length; i++) {
  //   const change = data[i];
  //   if (change.type == "command") {
  //     console.log("change", change);
  //     const stdout = await runCommand(change.command);
  //     console.log(stdout);
  //   }
  // }
})();
