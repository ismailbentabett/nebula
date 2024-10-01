export interface FrameworkHandler {
    findComponentFiles(projectDir: string): Promise<string[]>;
    extractClassesAndIds(filePath: string): Promise<{ classes: string[]; ids: string[] }>;
    injectCssImport(filePath: string, cssFileName: string): Promise<void>;
    getComponentName(filePath: string): string;
  }  