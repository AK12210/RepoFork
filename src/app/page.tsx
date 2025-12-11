import { Github } from 'lucide-react';
import { Logo } from '@/components/icons';
import { RepoForm } from '@/components/repo-form';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="flex items-center gap-4 mb-6">
        <Logo className="h-16 w-16 text-primary" />
        <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter">
          RepoFork
        </h1>
      </div>
      <p className="max-w-2xl mb-8 text-lg text-muted-foreground">
        Paste a GitHub repository URL to clone, browse, and generate an AI-powered summary of its contents.
      </p>
      <div className="w-full max-w-2xl">
        <RepoForm />
      </div>
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <Github className="w-4 h-4" />
          <span>Powered by the GitHub API</span>
        </a>
      </footer>
    </main>
  );
}
