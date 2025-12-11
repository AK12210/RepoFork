import type { Repo, TreeFile, Languages } from './types';

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

type GitHubApiResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

async function fetchGitHubAPI<T>(path: string): Promise<GitHubApiResult<T>> {
  const headers: HeadersInit = {
    "Accept": "application/vnd.github.v3+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  }
  
  try {
    const response = await fetch(`${GITHUB_API_URL}${path}`, { headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || `GitHub API error: ${response.status} ${response.statusText}`;
      
      let userMessage = `Failed to fetch data for ${path}. Reason: ${message}`;
      if (response.status === 404) {
          userMessage = `The requested resource at ${path} was not found. It might be a private repository or an incorrect name.`
      } else if (response.status === 403) {
          userMessage = `API rate limit exceeded. Please add a GITHUB_TOKEN to your .env.local file to increase the rate limit, and then try again.`
      }

      console.error(`GitHub API error: ${response.status} ${response.statusText} for path ${path}`);
      return { success: false, error: userMessage };
    }
    const data = await response.json() as T;
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch from GitHub API:", error);
    return { success: false, error: 'An unexpected network error occurred while fetching from the GitHub API.' };
  }
}

export async function getRepo(owner: string, repo: string): Promise<GitHubApiResult<Repo>> {
  return fetchGitHubAPI<Repo>(`/repos/${owner}/${repo}`);
}

export async function getRepoTree(owner: string, repo: string, branch: string): Promise<GitHubApiResult<TreeFile[]>> {
  const result = await fetchGitHubAPI<{ tree: TreeFile[] }>(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
  if (result.success) {
    return { success: true, data: result.data.tree };
  }
  return result;
}

export async function getRepoLanguages(owner: string, repo: string): Promise<GitHubApiResult<Languages>> {
  return fetchGitHubAPI<Languages>(`/repos/${owner}/${repo}/languages`);
}

export async function getFileContentRaw(owner: string, repo: string, path: string): Promise<GitHubApiResult<string>> {
    const dataResult = await fetchGitHubAPI<{ content?: string; encoding?: string }>(`/repos/${owner}/${repo}/contents/${path}`);
    
    if (!dataResult.success) {
        return dataResult;
    }

    const data = dataResult.data;

    if (data && data.content && data.encoding === 'base64') {
        try {
            const decodedContent = atob(data.content);
            return { success: true, data: decodedContent };
        } catch (e) {
            console.error('Failed to decode base64 content for path:', path, e);
            if (typeof Buffer !== 'undefined') {
                const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
                return { success: true, data: decodedContent };
            }
            return { success: false, error: `Failed to decode file content for ${path}.`};
        }
    }
    return { success: false, error: `No content found for file ${path}.`};
}
