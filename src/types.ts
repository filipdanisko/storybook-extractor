export type docsOption = {
  heading: string | undefined;
  firstParagraph: string | undefined;
  tablesHtml: Array<string | undefined>;
  codeSnippets: Array<string | undefined>;
  fullText: string | undefined;
  rawHtml?: string | undefined;
};

export type StorybookFormatedData = {
  id: string;
  title: string;
  storyPath: string;
  storyName: string;
  componentName: string;
  urls: {
    storyUrl: string;
    docsUrl: string;
    storyUrlIframe: string;
    docsUrlIframe: string;
  };
  raw: any; //TODO: type properly using Storybook types
};
export type StorybookMetadataOutput = StorybookFormatedData & {
  docs?: docsOption;
  pictureBase64?: string;
};

export type Options = {
  url?: string;
  output?: string;
  concurentScrapers?: number;
  postProcess?: Array<string>;
};
