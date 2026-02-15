import "server-only";

/**
 * Pure TypeScript implementation of Jupytext percent-format → .ipynb conversion.
 * No Python/Jupytext dependency needed.
 *
 * Parses the percent format:
 *   # %% [markdown]   → markdown cell (lines prefixed with "# ")
 *   # %%              → code cell
 */

interface NotebookCell {
  cell_type: "code" | "markdown";
  metadata: Record<string, unknown>;
  source: string[];
  execution_count?: null;
  outputs?: never[];
}

interface Notebook {
  cells: NotebookCell[];
  metadata: {
    kernelspec: {
      display_name: string;
      language: string;
      name: string;
    };
    language_info: {
      name: string;
      version: string;
      file_extension: string;
      mimetype: string;
      codemirror_mode: {
        name: string;
        version: number;
      };
    };
  };
  nbformat: number;
  nbformat_minor: number;
}

export function convertToNotebook(pythonContent: string): string {
  const lines = pythonContent.split("\n");
  const cells: NotebookCell[] = [];

  let currentType: "code" | "markdown" = "code";
  let currentLines: string[] = [];
  let inCell = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect cell markers
    if (trimmed === "# %% [markdown]" || trimmed === "# %% [md]") {
      // Flush previous cell
      if (inCell) {
        pushCell(cells, currentType, currentLines);
      }
      currentType = "markdown";
      currentLines = [];
      inCell = true;
      continue;
    }

    if (trimmed === "# %%") {
      // Flush previous cell
      if (inCell) {
        pushCell(cells, currentType, currentLines);
      }
      currentType = "code";
      currentLines = [];
      inCell = true;
      continue;
    }

    // Handle "# %% some title" (code cell with title, ignore the title)
    if (/^# %% \S/.test(trimmed) && !trimmed.includes("[markdown]") && !trimmed.includes("[md]")) {
      if (inCell) {
        pushCell(cells, currentType, currentLines);
      }
      currentType = "code";
      currentLines = [];
      inCell = true;
      continue;
    }

    if (!inCell) {
      // Lines before the first cell marker → treat as code cell
      inCell = true;
      currentType = "code";
    }

    currentLines.push(line);
  }

  // Flush last cell
  if (inCell && currentLines.length > 0) {
    pushCell(cells, currentType, currentLines);
  }

  // If no cells were created, wrap everything in a single code cell
  if (cells.length === 0) {
    cells.push(makeCodeCell(lines));
  }

  const notebook: Notebook = {
    cells,
    metadata: {
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3",
      },
      language_info: {
        name: "python",
        version: "3.10.0",
        file_extension: ".py",
        mimetype: "text/x-python",
        codemirror_mode: {
          name: "ipython",
          version: 3,
        },
      },
    },
    nbformat: 4,
    nbformat_minor: 5,
  };

  return JSON.stringify(notebook, null, 1);
}

function pushCell(
  cells: NotebookCell[],
  type: "code" | "markdown",
  lines: string[]
): void {
  // Trim leading/trailing empty lines
  while (lines.length > 0 && lines[0].trim() === "") lines.shift();
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();

  if (lines.length === 0) return;

  if (type === "markdown") {
    cells.push(makeMarkdownCell(lines));
  } else {
    cells.push(makeCodeCell(lines));
  }
}

function makeMarkdownCell(lines: string[]): NotebookCell {
  // Strip "# " prefix from markdown lines (jupytext format)
  const source = lines.map((line, i) => {
    let stripped: string;
    if (line.startsWith("# ")) {
      stripped = line.slice(2);
    } else if (line === "#") {
      stripped = "";
    } else {
      stripped = line;
    }
    // Add newline to all lines except the last
    return i < lines.length - 1 ? stripped + "\n" : stripped;
  });

  return {
    cell_type: "markdown",
    metadata: {},
    source,
  };
}

function makeCodeCell(lines: string[]): NotebookCell {
  const source = lines.map((line, i) =>
    i < lines.length - 1 ? line + "\n" : line
  );

  return {
    cell_type: "code",
    metadata: {},
    source,
    execution_count: null,
    outputs: [],
  };
}
