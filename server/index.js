import express from 'express';
import expressWs from 'express-ws';
import discordRpc from 'discord-rpc';
import { setRpc, updateRpc, removeRpc } from './functions/index.js';

const app = express();
const port = 3000;
expressWs(app);

// Dont change this
global.initialize = false;
global.clientId = '1114057433736814662';

// RPC
global.rpc = new discordRpc.Client({ transport: 'ipc' });
global.rpc.on('ready', () => console.log('Discord RPC connected'));
global.rpc.login({ clientId }).catch(console.error);

// RPC Settings
global.rpcSettings = {
  largeImageKey: 'yt_large',
  largeImageText: 'Youtube',
  smallImageKey: 'yt_small',
  smallImageText: 'Youtube',
  instance: false,
  buttons: [
    {
      label: 'Try Youtube Music RPC',
      url: 'https://github.com/orcunxrd/youtube-music-rpc',
    }
  ]
}

// Actions
const actions = { setRpc, updateRpc, removeRpc };

app.ws('/', async (ws, req) => {
  console.log('A client connected.');

  ws.on('message', async (message) => {
    const { action, data } = JSON.parse(message);
    await actions[action](data);
  });

  ws.on('close', async () => {
    console.log('A client disconnected.');
    global.rpc.clearActivity();
  });
});

app.listen(port, async () => {
  console.log(`Server running http://localhost:${port}`);
});