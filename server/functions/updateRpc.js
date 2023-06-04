import setRpc from "./setRpc.js";
import { convertSeconds } from "../helpers/index.js";
let isIdled = false;

const isListening = async (data) => {
  if (!global.initialize || isIdled) {
    await setRpc(data);
    global.initialize = true;
    isIdled = false;
  }

  global.rpcSettings.state = `Listening to Music (${convertSeconds(data.now)} / ${convertSeconds(data.max)})`;
  global.rpc.setActivity(global.rpcSettings);
}

const isIdle = async () => {
  isIdled = true;
  global.rpcSettings.largeImageKey = 'yt_large';
  global.rpcSettings.largeImageText = 'Youtube';
  global.rpcSettings.state = 'How about recommending a song?';
  global.rpcSettings.details = 'Not listening to any song.';
  global.rpcSettings.buttons = global.rpcSettings.buttons.slice(0, 1);
  global.rpc.setActivity(global.rpcSettings);
}

export default async (data) => {
  console.log('[YTM-RPC] | (UPDATE-RPC) =>', JSON.stringify(data));

  if (data.action == 'listening') await isListening(data);
  if (data.action == 'idle') await isIdle();
};