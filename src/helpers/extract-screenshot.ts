import asyncPool from 'tiny-async-pool';
import puppeteer from 'puppeteer';
import { PUPPETEER_SETTINGS } from '../consts';
import type { Options, StorybookFormatedData } from '../types';
import shrap from 'sharp';

const tryToTrimImageWhitespace = async (imageBuffer: string | Buffer) => {
  try {
    const trimmedImage = await shrap(imageBuffer).trim(1).toBuffer();
    return trimmedImage;
  } catch (error) {
    console.error(error);
  }

  return imageBuffer;
};

/**
 * Extracts screenshots from storybook stories.
 * It selectes first DOM element under #root and takes a screenshot of it.
 */
export const extractScreenshots = async (data, options: Options) => {
  const browser = await puppeteer.launch(PUPPETEER_SETTINGS);
  const withScreenshot = await asyncPool(
    options.concurentScrapers,
    data,
    async ({ urls, id, ...rest }: StorybookFormatedData) => {
      try {
        const page = await browser.newPage();

        await page.goto(urls.storyUrlIframe, {
          waitUntil: 'domcontentloaded',
        });

        const coordinates = await page.$eval('#root > *', (el) => {
          const rect = (<HTMLElement>el)?.getBoundingClientRect();
          return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          };
        });

        const picBuffer = await page.screenshot({
          type: 'png',
          omitBackground: true,
          clip: {
            x: coordinates.x,
            y: coordinates.y,
            width: coordinates.width === 0 ? 100 : coordinates.width,
            height: coordinates.height === 0 ? 100 : coordinates.height,
          },
        });

        const image = await tryToTrimImageWhitespace(picBuffer);

        await page.close();

        return {
          id,
          ...rest,
          urls,
          pictureBase64: `data:image/png;base64,${image.toString('base64')}`,
        };
      } catch (error) {
        console.error(id, error);
      }
    },
  );
  await browser.close();

  return withScreenshot;
};
