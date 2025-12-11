export type User = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
};

export type Repo = {
  id: number;
  name: string;
  full_name: string;
  owner: User;
  html_url: string;
  description: string;
  fork: boolean;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
  } | null;
};

export type TreeFile = {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
};

export interface FileTree {
  [key: string]: {
    path: string;
    type: 'blob' | 'tree';
    children?: FileTree;
  } & Omit<TreeFile, 'path' | 'type'>;
}

export type Languages = Record<string, number>;
