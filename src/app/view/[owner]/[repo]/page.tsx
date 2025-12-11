import { getRepoData } from "@/lib/actions";
import { RepoView } from "@/components/repo-view";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";

export default async function ViewRepoPage({
  params,
}: {
  params: { owner: string; repo: string };
}) {
  const { owner, repo } = params;
  const result = await getRepoData(owner, repo);

  if (!result || !result.success) {
    return (
      <div className="container mx-auto max-w-4xl py-12">
        <div className="flex items-center gap-2 mb-8 justify-center">
            <Link href="/" className="flex items-center gap-2 font-bold font-headline text-lg">
                <Logo className="w-6 h-6 text-primary" />
                <span>RepoFork</span>
            </Link>
        </div>
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Fetching Repository</AlertTitle>
          <AlertDescription>
            <p className="font-semibold mb-2">Could not load repository <span className="font-bold">{owner}/{repo}</span>.</p>
            {result?.error ? (
              <p>{result.error}</p>
            ) : (
              <p>An unknown error occurred.</p>
            )}
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
            <Button asChild>
                <Link href="/">Go Back Home</Link>
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen overflow-hidden">
        <header className="flex items-center h-14 border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-bold font-headline">
                <Logo className="w-6 h-6 text-primary" />
                <span>RepoFork</span>
            </Link>
        </header>
        <RepoView initialData={result} />
    </div>
  )
}
