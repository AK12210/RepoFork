"use client";

import { useState, useTransition } from "react";
import type { Repo, TreeFile, Languages, FileTree } from "@/lib/types";
import { getFileContent, generateSummary } from "@/lib/actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileBrowser } from "./file-browser";
import { RepoHeader } from "./repo-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeView } from "./code-view";
import { SummaryView } from "./summary-view";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { FileText, Terminal, FileCode, Bot } from "lucide-react";

type RepoViewProps = {
  initialData: {
    repo: Repo;
    tree: FileTree;
    languages: Languages | null;
    readme: { content: string; path: string } | null;
    contributing: { content: string; path: string } | null;
  };
};

export function RepoView({ initialData }: RepoViewProps) {
  const { repo, tree, languages, readme, contributing } = initialData;
  const [activeTab, setActiveTab] = useState("readme");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
    setFileContent(null);
    setActiveTab("code");
    startTransition(async () => {
      const content = await getFileContent(repo.owner.login, repo.name, path);
      setFileContent(content);
    });
  };

  return (
    <main className="grid grid-cols-[300px_1fr] h-[calc(100vh-theme(height.14))]">
      <aside className="border-r">
        <ScrollArea className="h-full">
          <FileBrowser tree={tree} onFileSelect={handleFileSelect} selectedFile={selectedFile} />
        </ScrollArea>
      </aside>
      <div className="flex flex-col overflow-hidden">
        <RepoHeader repo={repo} languages={languages} />
        <div className="flex-grow overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="mx-4 mt-4 self-start">
              <TabsTrigger value="readme">
                <FileText className="w-4 h-4 mr-2" /> README / Contributing
              </TabsTrigger>
              <TabsTrigger value="summary">
                <Bot className="w-4 h-4 mr-2" /> AI Summary
              </TabsTrigger>
              <TabsTrigger value="code" disabled={!selectedFile}>
                <FileCode className="w-4 h-4 mr-2" /> Code
              </TabsTrigger>
            </TabsList>
            <TabsContent value="readme" className="flex-grow overflow-auto mt-0">
                <div className="p-4 space-y-8">
                    {readme ? (
                        <div>
                            <h2 className="text-lg font-semibold mb-2 font-headline border-b pb-2">{readme.path}</h2>
                            <article className="prose dark:prose-invert max-w-none"><pre className="text-sm font-code bg-muted/50 p-4 rounded-md">{readme.content}</pre></article>
                        </div>
                    ) : (
                        <Alert>
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>No README.md found</AlertTitle>
                            <AlertDescription>This repository does not contain a README.md file.</AlertDescription>
                        </Alert>
                    )}
                    {contributing && (
                         <div>
                            <h2 className="text-lg font-semibold mb-2 font-headline border-b pb-2">{contributing.path}</h2>
                            <article className="prose dark:prose-invert max-w-none"><pre className="text-sm font-code bg-muted/50 p-4 rounded-md">{contributing.content}</pre></article>
                        </div>
                    )}
                </div>
            </TabsContent>
            <TabsContent value="summary" className="flex-grow overflow-auto mt-0">
              <SummaryView owner={repo.owner.login} repoName={repo.name} />
            </TabsContent>
            <TabsContent value="code" className="flex-grow overflow-hidden mt-0">
              {isPending && (
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              )}
              {!isPending && fileContent !== null && <CodeView content={fileContent} />}
              {!isPending && fileContent === null && selectedFile && (
                <div className="p-4">
                  <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error loading file</AlertTitle>
                    <AlertDescription>Could not load the content for {selectedFile}.</AlertDescription>
                  </Alert>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
