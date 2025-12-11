import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TreeFile, FileTree } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildFileTree(files: TreeFile[]): FileTree {
  const tree: FileTree = {};

  // Sort files by path to ensure parent directories are created before their children.
  const sortedFiles = files.sort((a, b) => (a.path || "").localeCompare(b.path || ""));

  for (const file of sortedFiles) {
    if (!file.path) continue;
    
    const parts = file.path.split('/');
    let currentLevel: any = tree;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (i === parts.length - 1) {
        // This is a file
        currentLevel[part] = { ...file, type: 'blob' };
      } else {
        // This is a directory
        if (!currentLevel[part]) {
          const currentPath = parts.slice(0, i + 1).join('/');
          currentLevel[part] = { path: currentPath, type: 'tree', children: {} };
        }
        currentLevel = currentLevel[part].children;
      }
    }
  }

  return tree;
}
