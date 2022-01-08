import path from 'path';
import fsextra from 'fs-extra';
import { extractDocs } from './helpers/extract-docs';
import type { Options } from './types';
import { extractScreenshots } from './helpers/extract-screenshot';
import { extractStorybookGlobals } from './helpers/extract-storybook-globals';
import { transformStorybookData } from './helpers/transform-storybook-data';

export async function extract(options: Options) {
  const iframeUrl = new URL('/iframe.html', options.url);
  const data = await extractStorybookGlobals(iframeUrl.href);
  const transformedData = transformStorybookData(data, options.url);

  const shortenDataJustForTesting = transformedData.slice(10, 20);

  // TODO: This could run concurrently
  if (transformedData.length > 0) {
    console.log(
      `Found ${transformedData.length} docs pages, extracting documentation...`,
    );
    const withDocs = await extractDocs(shortenDataJustForTesting, options);
    console.log(
      `Found ${transformedData.length} stories, extracting screenshots...`,
    );
    const fullData = await extractScreenshots(withDocs, options);

    await fsextra.writeFile(options.output, JSON.stringify(fullData, null, 2));

    if (options.postProcess.length > 0) {
      for (const postProcess of options.postProcess) {
        const pathToScript = path.resolve(process.cwd(), postProcess);
        await import(pathToScript).then((postProcess) => {
          if (typeof postProcess === 'function') {
            postProcess(fullData);
          } else if (typeof postProcess?.default === 'function') {
            postProcess.default(fullData);
          }
        });
      }
    }
  }
}
