import { ScrollArea } from "@/components/ui/scroll-area";

type CodeViewProps = {
  content: string;
};

export function CodeView({ content }: CodeViewProps) {
  return (
    <ScrollArea className="h-full">
      <pre className="p-4 text-sm font-code">
        <code>{content}</code>
      </pre>
    </ScrollArea>
  );
}
