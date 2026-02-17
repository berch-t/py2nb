"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Upload, FileCode, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_CODE_LENGTH, MAX_FILE_SIZE } from "@/lib/constants";

interface CodeInputProps {
  value: string;
  onChange: (code: string, fileName?: string) => void;
  disabled?: boolean;
}

export function CodeInput({ value, onChange, disabled }: CodeInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("codeInput");

  const handleFileRead = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".py")) {
        alert(t("errors.invalidFile"));
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(t("errors.fileTooBig"));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileName(file.name);
        onChange(content, file.name);
      };
      reader.readAsText(file);
    },
    [onChange, t]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileRead(file);
    },
    [handleFileRead]
  );

  const clearFile = () => {
    setFileName(null);
    onChange("");
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-colors ${
          isDragging
            ? "border-indigo-400 bg-indigo-50/50 dark:border-zinc-400 dark:bg-zinc-500/10"
            : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600"
        }`}
      >
        {fileName && (
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <FileCode className="h-4 w-4" />
              {fileName}
            </div>
            <button onClick={clearFile} className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <textarea
          value={value}
          onChange={(e) => {
            setFileName(null);
            onChange(e.target.value);
          }}
          disabled={disabled}
          placeholder={t("placeholder")}
          className="min-h-[300px] w-full resize-y rounded-xl bg-transparent p-4 font-mono text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none disabled:opacity-50 dark:text-zinc-200 dark:placeholder:text-zinc-600"
          maxLength={MAX_CODE_LENGTH}
          spellCheck={false}
        />

        {!value && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-400 dark:text-zinc-600">
            <Upload className="h-8 w-8" />
            <span className="text-sm">{t("dragDrop")}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <Upload className="h-3 w-3" />
            {t("upload")}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".py"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileRead(file);
            }}
          />
        </div>
        <span>
          {value.length.toLocaleString()} / {MAX_CODE_LENGTH.toLocaleString()} {t("characters")}
          {value && ` | ${value.split("\n").length} ${t("lines")}`}
        </span>
      </div>
    </div>
  );
}
