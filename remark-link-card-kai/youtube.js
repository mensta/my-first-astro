const DEFAULT_WIDTH = 560;
// const DEFAULT_HEIGHT = 315;
// const DEFAULT_WIDTH = '100%';
const DEFAULT_HEIGHT = 'auto';
const URL_PATTERN = /^https:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)([0-9A-Za-z_-]+)$/;

const replaceYoutubeLink = (node, options) => {
  let videoId = '';
  let videoUrl = '';
  for (const child of node.children) {
    // parse type = 'link' for 'remark-gfm'
    if (child.type === 'text' || child.type === 'link') {
      const url = child?.url ?? child?.value;
      const match = url.match(URL_PATTERN);
      if (match && match[1]) {
        videoId = match[1];
        videoUrl = url;
        break;
      }
    }
  }

  if (!videoId || !videoUrl) {
    return false;
  }

  const text = {
    type: 'text',
    value: videoUrl,
    data: {
      hName: 'iframe',
      hProperties: {
        width: options?.width ?? DEFAULT_WIDTH,
        height: options?.height ?? DEFAULT_HEIGHT,
        src: `https://www.youtube.com/embed/${videoId}`,
        frameborder: '0',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        allowfullscreen: true,
        style: 'max-width: 100%; aspect-ratio: 16 / 9;'
      },
      hChildren: [],
    },
  };
  node.children = [text];

  return true;
}

module.exports = replaceYoutubeLink;
