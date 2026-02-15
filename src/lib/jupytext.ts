import "server-only";

import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, readFile, mkdir, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { v4 as uuidv4 } from "uuid";

const execAsync = promisify(exec);
const TIMEOUT_MS = 30_000;

export async function convertToNotebook(
  pythonContent: string
): Promise<string> {
  const sessionId = uuidv4();
  const tempDir = join(tmpdir(), `py2nb-${sessionId}`);

  try {
    await mkdir(tempDir, { recursive: true });

    const pyFile = join(tempDir, "script.py");
    const ipynbFile = join(tempDir, "script.ipynb");

    await writeFile(pyFile, pythonContent, "utf-8");

    // Try multiple jupytext execution methods
    // 1. python3 -m jupytext (most reliable, uses system-installed jupytext)
    // 2. uvx jupytext (isolated execution via uv)
    // 3. jupytext (direct command if in PATH)
    const commands = [
      `python3 -m jupytext --to notebook "${pyFile}" -o "${ipynbFile}"`,
      `uvx jupytext --to notebook "${pyFile}" -o "${ipynbFile}"`,
      `jupytext --to notebook "${pyFile}" -o "${ipynbFile}"`,
    ];

    let lastError: Error | null = null;

    for (const command of commands) {
      try {
        await Promise.race([
          execAsync(command, { maxBuffer: 10 * 1024 * 1024 }),
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error("Jupytext conversion timeout")),
              TIMEOUT_MS
            )
          ),
        ]);

        const notebookJson = await readFile(ipynbFile, "utf-8");
        return notebookJson;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (!lastError.message.includes("command not found")) {
          throw lastError;
        }
      }
    }

    throw lastError || new Error("Jupytext not available");
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
}
