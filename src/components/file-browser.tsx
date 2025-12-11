"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FileIcon } from "./file-icon";
import type { FileTree } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FileBrowserProps {
  tree: FileTree;
  onFileSelect: (path: string) => void;
  selectedFile: string | null;
}

interface FileNodeProps {
  name: string;
  node: any;
  onFileSelect: (path: string) => void;
  selectedFile: string | null;
  level: number;
}

function FileNode({ name, node, onFileSelect, selectedFile, level }: FileNodeProps) {
  const [isOpen, setIsOpen] = useState(level < 1);

  if (node.type === "tree") {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center text-left text-sm py-1 px-2 rounded-md hover:bg-muted"
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4 mr-1 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1 shrink-0" />
          )}
          <FileIcon type="dir" isOpen={isOpen} />
          <span className="ml-2 truncate">{name}</span>
        </button>
        {isOpen && (
          <div style={{ paddingLeft: `${level > 0 ? 16 : 0}px` }}>
            {Object.entries(node.children)
              .sort(([aName, aNode], [bName, bNode]) => {
                if ((aNode as any).type === (bNode as any).type) {
                  return aName.localeCompare(bName);
                }
                return (aNode as any).type === 'tree' ? -1 : 1;
              })
              .map(([childName, childNode]) => (
                <FileNode
                  key={childName}
                  name={childName}
                  node={childNode}
                  onFileSelect={onFileSelect}
                  selectedFile={selectedFile}
                  level={level + 1}
                />
              ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => onFileSelect(node.path)}
      style={{ paddingLeft: `${level * 16}px` }}
      className={cn(
        "w-full flex items-center text-left text-sm py-1 px-2 rounded-md hover:bg-muted",
        selectedFile === node.path && "bg-accent text-accent-foreground"
      )}
    >
      <FileIcon filename={name} />
      <span className="ml-2 truncate">{name}</span>
    </button>
  );
}

export function FileBrowser({ tree, onFileSelect, selectedFile }: FileBrowserProps) {
  return (
    <div className="p-2">
       {Object.entries(tree)
        .sort(([aName, aNode], [bName, bNode]) => {
          if (aNode.type === bNode.type) {
            return aName.localeCompare(bName);
          }
          return aNode.type === 'tree' ? -1 : 1;
        })
        .map(([name, node]) => (
          <FileNode
            key={name}
            name={name}
            node={node}
            onFileSelect={onFileSelect}
            selectedFile={selectedFile}
            level={0}
          />
        ))}
    </div>
  );
}
