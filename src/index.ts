#!/usr/bin/node
import { extract } from './extract';
import path from 'path';
import sade from 'sade';
import * as packageJson from '../package.json';

sade('storybook-extractor', true)
  .version(packageJson.version)
  .describe(packageJson.description)
  .option('-c, --config', 'Path to config file')
  .action(async (options) => {
    const configPath = path.resolve(process.cwd(), options.config);
    const config = await import(configPath);

    if (!config.concurentScrapers) {
      config.concurentScrapers = 10;
    }

    extract(config);
  })
  .parse(process.argv);
