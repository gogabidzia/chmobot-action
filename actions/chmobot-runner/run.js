const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const SYSTEM_MESSAGE = `You are an AI designed to assist in software development tasks. Your current task is to analyze a set of given file paths, their contents, and a user prompt to generate updates that need to be made to these files.
for all user requests, make sure to follow existing files and folders structure/naming and general conventions you see in codebase.
Your task is to output a list of Changes needed to complete the task. Output format should be following:
On first line write file path which needs to be updated or created.
After that you output code in markdown format. Keep in mind you should output whole content of file after changes.
Before file names, use prefix ---------- without blank space before file name.
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

USER_REQUEST: Add component TestPage under \`src/components/TestPage\` a component inside which counts button clicks and every ten clicks alerts you that you are as stupid as you were 10 clicks ago.
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

  const divider = "----------";

  console.log(text);

  const changes = text
    .split(divider)
    .filter((item) => item.trim().length > 0)
    .map((item) => {
      const lines = item.split("\n");
      const line = lines[0];
      const content = lines.slice(2, -1);
      return { filePath: line, content: content.join("\n") };
    });
  console.log(changes);
};

function scanDirectory(dir, relativePath = "") {
  const result = {};
  const excluded_dirs = [".git", "node_modules"];
  const whitelist = [".ts", "js", "tsx", "jsx", ".css", ".mjs", ".cjs"];
  // Read the contents of the directory
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const itemRelativePath = path.join(relativePath, item);
    if (excluded_dirs.some((dir) => item.includes(dir))) return;

    // Check if the current item is a directory or a file
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
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
  console.log(`files choosen:`, Object.keys(dir).length, Object.keys(dir));
  const data = await test("/github/workspace", JSON.stringify(dir));
})();
