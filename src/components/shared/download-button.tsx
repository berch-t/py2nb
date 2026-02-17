"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";

interface DownloadButtonProps {
  notebook: Record<string, unknown>;
  fileName?: string;
}

export function DownloadButton({ notebook, fileName }: DownloadButtonProps) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("converter.download");

  const handleDownload = () => {
    const json = JSON.stringify(notebook, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName
      ? fileName.replace(".py", ".ipynb")
      : "notebook.ipynb";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const json = JSON.stringify(notebook, null, 2);
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleDownload} size="sm" className="gap-1.5">
        <Download className="h-3.5 w-3.5" />
        {t("download")}
      </Button>
      <Button
        onClick={handleCopy}
        variant="outline"
        size="sm"
        className="gap-1.5"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        {copied ? t("copied") : t("copy")}
      </Button>
    </div>
  );
}
