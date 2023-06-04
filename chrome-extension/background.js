let socket = null;
let focusedTabId = null;
let currentMusicId = null;
let firstInitialize = false;

const trackingInterception = async (e) => {
  if (!e.url.startsWith('https://music.youtube.com/ptracking')) return;
  if (!focusedTabId) focusedTabId = e.tabId;
  if (e.tabId != focusedTabId) return;

  if (!currentMusicId)
    chrome.tabs.sendMessage(focusedTabId, { action: 'sliderListener' });

  const urlParams = new URLSearchParams(e.url);
  currentMusicId = urlParams.get('video_id');

  socket.send(JSON.stringify({
    listener: 'setRpc',
    data: { currentMusicId }
  }));

  console.log('[YTM-RPC] (INTERCEPTION) => Music ID:', currentMusicId);
};

chrome.webRequest.onCompleted.addListener(
  trackingInterception,
  { urls: ['https://music.youtube.com/*'] },
);

chrome.runtime.onMessage.addListener((request) => {
  if (request.listener != 'updateRpc') return;

  socket.send(JSON.stringify({
    listener: 'updateRpc',
    data: { currentMusicId, ...request }
  }));
});

chrome.tabs.onRemoved.addListener((_tabId, removeInfo) => {
  chrome.tabs.query({ url: "https://music.youtube.com/*" }, (tabs) => {
    const hasYtmTab = tabs.some(tab => tab.windowId === removeInfo.windowId);

    if (!hasYtmTab) {
      focusedTabId = null;
      currentMusicId = null;
      socket.send(JSON.stringify({ listener: 'removeRpc' }));
    }

    if (tabs.length == 1) {
      currentMusicId = null;
      if (focusedTabId == tabs[0].id) return;

      focusedTabId = tabs[0].id;
      socket.send(JSON.stringify({ listener: 'updateRpc', data: { action: 'idle' } }));
    }
  });
});

chrome.webNavigation.onCommitted.addListener((tab) => {
  if (!tab.url.includes('music.youtube.com')) return;
  
  if (!focusedTabId) {
    focusedTabId = tab.tabId;
    return;
  }

  if (tab.tabId != focusedTabId) return;

  if (currentMusicId) socket.send(JSON.stringify({ listener: 'updateRpc', data: { action: 'idle' } }));
  else socket.send(JSON.stringify({ listener: 'removeRpc' }));
  
  currentMusicId = null;
});

chrome.tabs.onCreated.addListener((tab) => {
  if (!tab.pendingUrl || !tab.pendingUrl.includes('music.youtube.com')) return;
  
  if (!focusedTabId) {
    focusedTabId = tab.id;
    return;
  }

  if (tab.id != focusedTabId) return;
});

const createWs = () => {
  socket = new WebSocket('ws://localhost:3000');

  socket.onclose = (event) => {
    if (event.wasClean) console.log('[YTM-RPC] (WEBSOCKET) => Connection closed.');
    else {
      console.log('[YTM-RPC] (WEBSOCKET) => Connection died.');
      setTimeout(createWs, 3000);
    }
  }

  socket.onopen = () => console.log('[YTM-RPC] (WEBSOCKET) => Connection established.');
  socket.onerror = (error) => console.log('[YTM-RPC] (WEBSOCKET) => Error:', error);
}

createWs();