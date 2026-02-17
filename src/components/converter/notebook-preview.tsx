"use client";

import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface NotebookCell {
  cell_type: "markdown" | "code" | "raw";
  source: string[];
  metadata?: Record<string, unknown>;
  outputs?: unknown[];
  execution_count?: number | null;
}

interface NotebookPreviewProps {
  notebook: {
    cells?: NotebookCell[];
    [key: string]: unknown;
  } | null;
}

export function NotebookPreview({ notebook }: NotebookPreviewProps) {
  const t = useTranslations("converter.preview");

  if (!notebook?.cells) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
        <p className="text-sm text-zinc-400 dark:text-zinc-600">
          {t("empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 rounded-xl border border-zinc-200 bg-white/50 overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="border-b border-zinc-200 px-4 py-2 text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
        {t("cells", { count: notebook.cells.length })}
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {notebook.cells.map((cell, index) => (
          <div
            key={index}
            className="border-b border-zinc-200/50 last:border-0 dark:border-zinc-800/50"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  cell.cell_type === "code"
                    ? "bg-emerald-500"
                    : "bg-blue-500"
                }`}
              />
              {cell.cell_type === "code" ? "Python" : "Markdown"}
              {cell.cell_type === "code" && cell.execution_count != null && (
                <span className="text-zinc-300 dark:text-zinc-700">
                  [{cell.execution_count}]
                </span>
              )}
            </div>

            <div className="px-4 pb-3">
              {cell.cell_type === "code" ? (
                <SyntaxHighlighter
                  language="python"
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    borderRadius: "0.5rem",
                    fontSize: "0.8125rem",
                    background: "rgba(0,0,0,0.3)",
                  }}
                >
                  {cell.source.join("")}
                </SyntaxHighlighter>
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{cell.source.join("")}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
