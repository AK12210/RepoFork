import type { Languages } from "@/lib/types";
import { Progress } from "./ui/progress";

type TechStackProps = {
  languages: Languages;
};

const languageColors: Record<string, string> = {
  JavaScript: "bg-[#f1e05a]",
  TypeScript: "bg-[#3178c6]",
  Python: "bg-[#3572A5]",
  Java: "bg-[#b07219]",
  HTML: "bg-[#e34c26]",
  CSS: "bg-[#563d7c]",
  Shell: "bg-[#89e051]",
  Go: "bg-[#00ADD8]",
  Ruby: "bg-[#701516]",
  PHP: "bg-[#4F5D95]",
  Other: "bg-muted",
};

export function TechStack({ languages }: TechStackProps) {
  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  if (totalBytes === 0) return null;

  const languagesWithPercentages = Object.entries(languages).map(([lang, bytes]) => ({
    name: lang,
    percentage: ((bytes / totalBytes) * 100).toFixed(2),
  }));

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">Languages</h3>
      <div className="flex flex-col gap-2">
        {languagesWithPercentages.map(({ name, percentage }) => (
          <div key={name}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium">{name}</span>
              <span className="text-muted-foreground">{percentage}%</span>
            </div>
            <Progress value={parseFloat(percentage)} className="h-2 [&>div]:bg-primary" />
          </div>
        ))}
      </div>
    </div>
  );
}
