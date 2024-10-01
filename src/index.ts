import { AngularHandler } from './frameworks/AngularHandler';
import { FrameworkHandler } from './frameworks/FrameworkHandler';
import { ReactHandler } from './frameworks/ReactHandler';
import { SvelteHandler } from './frameworks/SvelteHandler';
import { VueHandler } from './frameworks/VueHandler';
import { NebulaConfig, defaultConfig } from './utils/Config';
import { generateCssForComponent } from './utils/FileUtils';
import { compileSass, extractStylesForClasses } from './utils/StyleCompiler';

export class Nebula {
  private config: NebulaConfig;
  private handler: FrameworkHandler;

  constructor(config?: Partial<NebulaConfig>) {
    this.config = { ...defaultConfig, ...config };
    this.handler = this.getFrameworkHandler();
  }

  private getFrameworkHandler(): FrameworkHandler {
    switch (this.config.framework) {
      case 'vue':
        return new VueHandler(this.config);
      case 'react':
        return new ReactHandler(this.config);
      case 'svelte':
        return new SvelteHandler(this.config);
      case 'angular':
        return new AngularHandler(this.config);
      default:
        throw new Error(`Unsupported framework: ${this.config.framework}`);
    }
  }

  public async process(): Promise<void> {
    const componentFiles = await this.handler.findComponentFiles(
      this.config.projectDir
    );

    const compiledCss = compileSass(
      this.config.scssFilePath,
      this.config.outputStyle
    );

    for (const file of componentFiles) {
      const { classes } = await this.handler.extractClassesAndIds(file);
      const extractedStyles = extractStylesForClasses(
        compiledCss,
        classes,
        this.config
      );
      const cssFileName = `${this.handler.getComponentName(file)}.css`;

      await generateCssForComponent(file, extractedStyles, cssFileName);
      await this.handler.injectCssImport(file, cssFileName);
    }
  }
}

export default Nebula;
