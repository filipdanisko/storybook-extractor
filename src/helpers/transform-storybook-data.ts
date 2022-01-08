import crypto from 'crypto';

export const transformStorybookData = (rawData: unknown, url: string) => {
  return Object.keys(rawData).map((key) => {
    const { id, kind, name, story } = rawData[key];

    const kindSplit = kind.split('/');
    const componentName = kindSplit[kindSplit.length - 1];

    const hash = crypto.createHash('md5').update(id).digest('hex');

    return {
      id: hash,
      title: `${componentName}/${story}`,
      storyPath: kind,
      storyName: name,
      storyId: id,
      componentName,
      urls: {
        storyUrl: new URL(`?path=/story/${id}`, url).href,
        storyUrlIframe: new URL(
          `/iframe.html?id=${id}&args=&viewMode=story`,
          url,
        ).href,
        docsUrl: new URL(`?path=/docs/${id}`, url).href,
        docsUrlIframe: new URL(`/iframe.html?id=${id}&viewMode=docs`, url).href,
      },
      raw: rawData[key],
    };
  });
};
