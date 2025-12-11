"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { generateSummary } from "@/lib/actions";
import { Bot, Loader2, Sparkles } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";

type SummaryViewProps = {
  owner: string;
  repoName: string;
};

export function SummaryView({ owner, repoName }: SummaryViewProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGenerateSummary = () => {
    setError(null);
    setSummary(null);
    startTransition(async () => {
      const result = await generateSummary(owner, repoName);
      if (result.summary) {
        setSummary(result.summary);
      } else {
        setError(result.error || "An unknown error occurred.");
      }
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
          <Bot className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold font-headline mb-2">Generate AI Summary</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Get a quick overview of this repository, including key files, technologies, and contribution guidelines.
          </p>
          <Button onClick={handleGenerateSummary} disabled={isPending}>
            {isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Sparkles className="mr-2" />
            )}
            {isPending ? "Generating..." : "Generate Summary"}
          </Button>
        </div>

        {isPending && (
          <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold font-headline">Summary</h3>
                <p className="text-muted-foreground animate-pulse">AI is analyzing the repository...</p>
              </div>
          </div>
        )}

        {error && (
            <div className="mt-6">
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error Generating Summary</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )}

        {summary && (
          <div className="mt-6">
             <h3 className="text-lg font-semibold font-headline mb-2 border-b pb-2">AI Generated Summary</h3>
            <pre className="text-sm font-code whitespace-pre-wrap leading-relaxed">
              {summary}
            </pre>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
