import Nebula from '../src/index';
import { NebulaConfig } from '../src/utils/Config';

describe('Nebula Package', () => {
  const testConfig: Partial<NebulaConfig> = {
    projectDir: './test-project',
    scssFilePath: './test-project/assets/scss/main.scss',
    framework: 'vue',
    exclude: ['**/node_modules/**', '**/dist/**'],
    include: ['**/components/**', '**/pages/**'],
  };

  it('should process Vue components without errors', async () => {
    const nebula = new Nebula(testConfig);
    await expect(nebula.process()).resolves.not.toThrow();
  });

  // Additional tests for other frameworks and configurations
});