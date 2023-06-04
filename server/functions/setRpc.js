import { getInfo } from "../helpers/index.js";

export default async (data) => {
  const { currentMusicId } = data;
  if (!currentMusicId)
    return console.log('[YTM-RPC] => No music ID');

  const { videoDetails: {
    author,
    title,
    thumbnail: { thumbnails }
  } } = await getInfo(currentMusicId);

  const musicTitle = `${author} - ${title}`;
  const thumbnail = thumbnails[thumbnails.length - 1].url;

  global.rpcSettings.details = musicTitle;
  global.rpcSettings.largeImageKey = thumbnail;

  if (!global.rpcSettings.state) {
    global.rpcSettings.state = 'Listening to Music';
  }

  global.rpcSettings.buttons = global.rpcSettings.buttons.slice(0, 1);
  global.rpcSettings.buttons.push({
    label: 'Play on Youtube Music',
    url: `https://music.youtube.com/watch?v=${currentMusicId}`,
  });

  global.rpc.setActivity(global.rpcSettings);
};