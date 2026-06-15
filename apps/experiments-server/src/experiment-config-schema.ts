import { z } from 'zod'

export const experimentConfigSchema = z.object({
  name: z.string().describe('The unique identifier/slug of the experiment (used for the folder name and URL)'),
  title: z.string().describe('The human-readable display name shown in lists'),
  description: z.string().describe('A brief description of the experiment'),
  tags: z.array(z.string()).describe('Keywords associated with the experiment'),
  list: z.boolean().describe('Whether to include this experiment in generated lists'),
  include: z
    .string()
    .describe('A list of experiment names to include in this experiment'),
})

export type ExperimentConfig = z.infer<typeof experimentConfigSchema>
export const experimentConfigSchemaExtended = experimentConfigSchema.extend({
  rootPath: z.string().describe('The root path of the experiment folder, relative to the project root'),
  includePath: z
    .string()
    .describe('The path to the experiment folder, relative to the project root'),
  hasScreenshot: z
    .boolean()
    .describe('Whether a standardized screenshot.png exists next to the experiment config'),
})

export type ExperimentConfigExtended = z.infer<typeof experimentConfigSchemaExtended>