import puppeteer from 'puppeteer';
import { PUPPETEER_SETTINGS } from '../consts';

export const extractStorybookGlobals = async (url: string) => {
  const browser = await puppeteer.launch(PUPPETEER_SETTINGS);
  const page = await browser.newPage();
  await page.goto(url);

  const data = JSON.parse(
    await page.evaluate(async () => {
      // eslint-disable-next-line no-undef
      return JSON.stringify(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.__STORYBOOK_STORY_STORE__.extract(),
        null,
        2,
      );
    }),
  );

  setImmediate(() => {
    browser.close();
  });

  return data;
};
