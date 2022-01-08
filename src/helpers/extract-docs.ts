import asyncPool from 'tiny-async-pool';
import puppeteer from 'puppeteer';
import { PUPPETEER_SETTINGS } from '../consts';
import type { Options, StorybookFormatedData } from '../types';

/**
 * Extracts HTML from /docs/ pages from storybook.
 */
export const extractDocs = async (data, options: Options) => {
  const browser = await puppeteer.launch(PUPPETEER_SETTINGS);

  const withDocs = await asyncPool(
    options.concurentScrapers,
    data,
    async ({ urls, ...rest }: StorybookFormatedData) => {
      try {
        const page = await browser.newPage();

        await page.goto(urls.docsUrlIframe, {
          waitUntil: 'domcontentloaded',
        });

        const docsData = await page.$eval('#docs-root', (el) => {
          return {
            heading: el.querySelector('h1')?.innerText,
            firstParagraph: el.querySelector('p')?.innerText,
            tablesHtml: [...el.querySelectorAll('table')].map(
              (el) => el?.outerHTML,
            ),
            codeSnippets: [...el.querySelectorAll('pre code')].map(
              (el) => (<HTMLElement>el)?.innerText,
            ),
            fullText: (<HTMLElement>el)?.innerText,
            rawHtml: (<HTMLElement>el)?.innerHTML,
          };
        });

        await page.close();

        return { ...rest, urls, docs: docsData };
      } catch (error) {
        console.error(rest.id, error);
      }
    },
  );

  await browser.close();

  return withDocs;
};
