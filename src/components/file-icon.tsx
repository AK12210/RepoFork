import {
  File,
  FileJson,
  FileCode,
  FileImage,
  Folder,
  FolderOpen,
  FileText,
} from "lucide-react";

type FileIconProps = {
  filename?: string;
  type?: "file" | "dir";
  isOpen?: boolean;
};

export function FileIcon({ filename, type, isOpen }: FileIconProps) {
  if (type === "dir") {
    return isOpen ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />;
  }

  const extension = filename?.split(".").pop()?.toLowerCase();
  
  switch (extension) {
    case "json":
      return <FileJson className="h-4 w-4" />;
    case "js":
    case "ts":
    case "tsx":
    case "jsx":
    case "py":
    case "java":
    case "html":
    case "css":
    case "scss":
    case "go":
    case "rb":
    case "php":
      return <FileCode className="h-4 w-4" />;
    case "md":
    case "txt":
      return <FileText className="h-4 w-4" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
      return <FileImage className="h-4 w-4" />;
    default:
      return <File className="h-4 w-4" />;
  }
}
