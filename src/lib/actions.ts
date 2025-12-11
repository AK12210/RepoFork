'use server';

import { redirect } from 'next/navigation';
import {
  getRepo,
  getRepoTree,
  getRepoLanguages,
  getFileContentRaw,
} from './github';
import { buildFileTree } from './utils';
import { generateRepositorySummary } from '@/ai/flows/generate-repository-summary';

const GITHUB_REPO_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+)(?:\/)?$/;

export async function navigateToRepo(url: string) {
  const match = url.match(GITHUB_REPO_REGEX);
  if (!match || !match[1]) {
    return { error: 'Invalid GitHub repository URL.' };
  }
  const [owner, repo] = match[1].split('/');
  redirect(`/view/${owner}/${repo}`);
}

export async function getRepoData(owner: string, repoName: string) {
  try {
    const [repoResult, treeDataResult, languagesResult] = await Promise.all([
      getRepo(owner, repoName),
      getRepoTree(owner, repoName, 'main'),
      getRepoLanguages(owner, repoName),
    ]);

    if (!repoResult.success) {
      return { error: repoResult.error };
    }
    if (!treeDataResult.success) {
      return { error: treeDataResult.error };
    }

    const repo = repoResult.data;
    const treeData = treeDataResult.data;
    const languages = languagesResult.success ? languagesResult.data : null;

    if (!repo || !treeData) {
      return { error: 'Repository not found or the main branch is empty.' };
    }

    const tree = buildFileTree(treeData);

    const readmeFile = treeData.find(
      f => f.path.toLowerCase() === 'readme.md'
    );
    const contributingFile = treeData.find(
      f => f.path.toLowerCase() === 'contributing.md'
    );

    const [readmeContent, contributingContent] = await Promise.all([
      readmeFile
        ? getFileContentRaw(owner, repoName, readmeFile.path)
        : Promise.resolve({ success: true, data: null }),
      contributingFile
        ? getFileContentRaw(owner, repoName, contributingFile.path)
        : Promise.resolve({ success: true, data: null }),
    ]);

    return {
      success: true,
      repo,
      tree,
      languages,
      readme:
        readmeFile && readmeContent.success && readmeContent.data
          ? { content: readmeContent.data, path: readmeFile.path }
          : null,
      contributing:
        contributingFile && contributingContent.success && contributingContent.data
          ? { content: contributingContent.data, path: contributingFile.path }
          : null,
    };
  } catch (error) {
    console.error('Failed to get repo data:', error);
    return {
      error: 'An unexpected error occurred while fetching repository data.',
    };
  }
}

export async function getFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<string | null> {
  try {
    const result = await getFileContentRaw(owner, repo, path);
    return result.success ? result.data : null;
  } catch (error) {
    console.error(`Failed to get file content for ${path}:`, error);
    return null;
  }
}

export async function generateSummary(owner: string, repoName: string) {
  try {
    const treeResult = await getRepoTree(owner, repoName, 'main');
    if (!treeResult.success || !treeResult.data) {
      return {
        summary: null,
        error:
          treeResult.error || 'Could not fetch repository file tree.',
      };
    }
    const treeData = treeResult.data;

    const importantFiles = [
      'readme.md',
      'contributing.md',
      'package.json',
      'gemfile',
      'requirements.txt',
      'pom.xml',
      'build.gradle',
    ];

    const sourceFileExtensions = [
      '.js',
      '.ts',
      '.py',
      '.java',
      '.go',
      '.rb',
      '.php',
      '.tsx',
      '.jsx',
      '.html',
      '.css',
    ];

    const filesToFetch = treeData
      .filter(
        file =>
          importantFiles.includes(file.path.toLowerCase()) ||
          sourceFileExtensions.some(ext => file.path.toLowerCase().endsWith(ext))
      )
      .sort((a, b) => (b.size ?? 0) - (a.size ?? 0))
      .slice(0, 10);

    let repositoryContents = '';

    for (const file of filesToFetch) {
      const contentResult = await getFileContentRaw(owner, repoName, file.path);
      if (contentResult.success && contentResult.data) {
        repositoryContents += `\n\n--- FILE: ${
          file.path
        } ---\n\n${contentResult.data}`;
      }
    }

    if (!repositoryContents.trim()) {
      return {
        summary: null,
        error: 'Could not read any files to generate a summary.',
      };
    }

    const result = await generateRepositorySummary({ repositoryContents });
    return { summary: result.summary, error: null };
  } catch (error) {
    console.error('Error generating summary:', error);
    return {
      summary: null,
      error: 'An unexpected error occurred while generating the summary.',
    };
  }
}
