export const tags = {
  'open-gl': 'OpenGL',
  'shaders': 'Shaders'
} as const;

export type TagKey = keyof typeof tags;
export type TagName = typeof tags[TagKey];