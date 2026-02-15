"use client";

import { useState, useCallback, useRef } from "react";
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

  const handleFileRead = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".py")) {
        alert("Seuls les fichiers Python (.py) sont acceptes");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert("Fichier trop volumineux (max 5MB)");
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
    [onChange]
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
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-colors ${
          isDragging
            ? "border-zinc-400 bg-zinc-500/10"
            : "border-zinc-700 hover:border-zinc-600"
        }`}
      >
        {fileName && (
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <FileCode className="h-4 w-4" />
              {fileName}
            </div>
            <button onClick={clearFile} className="text-zinc-500 hover:text-zinc-300">
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
          placeholder="Collez votre code Python ici ou glissez-deposez un fichier .py..."
          className="min-h-[300px] w-full resize-y rounded-xl bg-transparent p-4 font-mono text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50"
          maxLength={MAX_CODE_LENGTH}
          spellCheck={false}
        />

        {!value && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-600">
            <Upload className="h-8 w-8" />
            <span className="text-sm">Glissez un fichier .py ici</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <Upload className="h-3 w-3" />
            Upload .py
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
          {value.length.toLocaleString()} / {MAX_CODE_LENGTH.toLocaleString()} caracteres
          {value && ` | ${value.split("\n").length} lignes`}
        </span>
      </div>
    </div>
  );
}
