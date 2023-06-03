import { getInfo } from "../helpers/index.js";

export default async (data) => {
  const { lastMusicId } = data;
  if (!lastMusicId) {
    return console.log('[YTM-RPC] => No music ID');
  }

  const { videoDetails: {
    author,
    title
  } } = await getInfo(lastMusicId);

  const rpcTitle = `${author} - ${title}`;
  global.rpcSettings.details = rpcTitle;

  if (!global.rpcSettings.state) {
    global.rpcSettings.state = 'Listening to Music';
  }

  const buttonIndex = global.rpcSettings.buttons.findIndex(button => button.label == 'Play on Youtube Music');

  if (buttonIndex == -1) {
    global.rpcSettings.buttons.push({
      label: 'Play on Youtube Music',
      url: `https://music.youtube.com/watch?v=${lastMusicId}`,
    })
  } else {
    global.rpcSettings.buttons[buttonIndex].url = `https://music.youtube.com/watch?v=${lastMusicId}`;
  }

  console.log('Listening to music =>', rpcTitle);
  global.rpc.setActivity(global.rpcSettings);
};