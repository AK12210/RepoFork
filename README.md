# RepoFork

RepoFork is a Next.js application that allows you to clone, browse, and analyze GitHub repositories. It provides features like file browsing, README display, technology stack identification, and an AI-powered summary generation.

## Features

- **Clone Repositories**: Enter a GitHub repository URL to start exploring.
- **Browse Files**: Navigate through the repository's file and directory structure.
- **View Code and READMEs**: View file contents, with special formatting for `README.md`.
- **AI-Powered Summary**: Generate a summary of the repository's purpose, key technologies, and structure.
- **Tech Stack Analysis**: Automatically identifies the programming languages used.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, pnpm, or yarn

### Environment Variables

To run this project, you will need to add the following environment variable to your `.env.local` file. It is recommended to use a GitHub Personal Access Token to avoid API rate limits.

`GITHUB_TOKEN` - Your GitHub Personal Access Token. You can create one [here](https://github.com/settings/tokens).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/repofork.git
    cd repofork
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Tech Stack

- [Next.js](https://nextjs.org/) – React Framework
- [Tailwind CSS](https://tailwindcss.com/) – CSS Framework
- [Shadcn/ui](https://ui.shadcn.com/) – Component Library
- [Genkit](https://firebase.google.com/docs/genkit) - AI Framework
- [Lucide React](https://lucide.dev/) - Icons
- [TypeScript](https://www.typescriptlang.org/) - Language

This project is owned by me, AK12210
