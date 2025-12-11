import type { Repo, Languages } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitFork, Star, Eye } from "lucide-react";
import { TechStack } from "./tech-stack";

type RepoHeaderProps = {
  repo: Repo;
  languages: Languages | null;
};

export function RepoHeader({ repo, languages }: RepoHeaderProps) {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={repo.owner.avatar_url} alt={repo.owner.login} />
          <AvatarFallback>{repo.owner.login.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold font-headline">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {repo.name}
            </a>
          </h1>
          <p className="text-muted-foreground">
            by <a href={repo.owner.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">{repo.owner.login}</a>
          </p>
        </div>
      </div>
      
      {repo.description && <p className="mb-4 text-muted-foreground">{repo.description}</p>}
      
      <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          <span>{repo.stargazers_count.toLocaleString()} stars</span>
        </div>
        <div className="flex items-center gap-1">
          <GitFork className="w-4 h-4" />
          <span>{repo.forks_count.toLocaleString()} forks</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{repo.watchers_count.toLocaleString()} watching</span>
        </div>
      </div>

      {languages && <TechStack languages={languages} />}
    </div>
  );
}
