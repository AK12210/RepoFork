'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a summary of a repository's contents.
 *
 * The flow takes repository content as input and uses a generative AI model to produce a summary,
 * highlighting key files, technologies used, and contribution guidelines.
 *
 * - generateRepositorySummary - The main function to trigger the repository summary generation.
 * - GenerateRepositorySummaryInput - The input type for the generateRepositorySummary function.
 * - GenerateRepositorySummaryOutput - The output type for the generateRepositorySummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRepositorySummaryInputSchema = z.object({
  repositoryContents: z.string().describe('The contents of the repository as a string.'),
});
export type GenerateRepositorySummaryInput = z.infer<typeof GenerateRepositorySummaryInputSchema>;

const GenerateRepositorySummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the repository contents.'),
});
export type GenerateRepositorySummaryOutput = z.infer<typeof GenerateRepositorySummaryOutputSchema>;

export async function generateRepositorySummary(input: GenerateRepositorySummaryInput): Promise<GenerateRepositorySummaryOutput> {
  return generateRepositorySummaryFlow(input);
}

const generateRepositorySummaryPrompt = ai.definePrompt({
  name: 'generateRepositorySummaryPrompt',
  input: {schema: GenerateRepositorySummaryInputSchema},
  output: {schema: GenerateRepositorySummaryOutputSchema},
  prompt: `You are an AI assistant that summarizes a code repository.

  Given the contents of the repository, identify the key files, technologies used,
  and any contribution guidelines. Produce a concise summary that helps users quickly
  understand the project.

  Repository Contents:
  {{repositoryContents}}
  `,
});

const generateRepositorySummaryFlow = ai.defineFlow(
  {
    name: 'generateRepositorySummaryFlow',
    inputSchema: GenerateRepositorySummaryInputSchema,
    outputSchema: GenerateRepositorySummaryOutputSchema,
  },
  async input => {
    const {output} = await generateRepositorySummaryPrompt(input);
    return output!;
  }
);
