export interface NebulaConfig {
  projectDir: string;
  scssFilePath: string;
  framework: 'vue' | 'react' | 'svelte' | 'angular';
  bootstrapPrefixes: string[];
  outputStyle: 'expanded' | 'compressed';
  customPrefixes: string[];
  exclude: string[];
  include: string[];
}

export const defaultConfig: NebulaConfig = {
  projectDir: './',
  scssFilePath: 'assets/scss/main.scss',
  framework: 'vue',
  bootstrapPrefixes: [
    'container',
    'row',
    'col',
    // ... (add all bootstrap prefixes)
  ],
  outputStyle: 'expanded',
  customPrefixes: [],
  exclude: ['**/node_modules/**'],
  include: [],
};
