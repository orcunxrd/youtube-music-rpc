console.log('[YTM-RPC] => Background.js loaded!');

let socket = null;
let lastMusicId = null;
let focusedTabId = null;

const sliderListener = () => {
  console.log('SLIDER LISTENER ADDED');
  chrome.tabs.sendMessage(focusedTabId, { action: 'sliderListener' });
}

const trackingInterception = async (details) => {
  if (!details.url.startsWith('https://music.youtube.com/ptracking')) return;
  if (details.tabId != focusedTabId) return;
  console.log('[YTM-RPC] (TRACKING) =>', details);

  if (!lastMusicId) sliderListener();
  const urlParams = new URLSearchParams(details.url);
  lastMusicId = urlParams.get('video_id');
  console.log('[YTM-RPC] (TRACKING) => Music ID:', lastMusicId);

  if (socket.readyState != 1) return;

  socket.send(JSON.stringify({
    action: 'setRpc',
    data: { lastMusicId }
  }));
}

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.action === 'updateRpc') {
    console.log('[YTM-RPC] (UPDATE-RPC) =>', request);

    socket.send(JSON.stringify({
      action: 'updateRpc',
      data: {
        lastMusicId,
        now: request.now,
        max: request.max
      }
    }));
  }
});

chrome.tabs.onRemoved.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    const currentTabs = tabs.filter(tab => tab.url && tab.url.includes('music.youtube.com'));
    if (!currentTabs.length) {
      console.log('[YTM-RPC] (REMOVE) => Last Music ID:', lastMusicId);
      lastMusicId = null;
      focusedTabId = null;
      socket.send(JSON.stringify({ action: 'removeRpc' }));
    }

    if (currentTabs.length == 1) {
      const lastTabId = currentTabs[0].id;
      lastMusicId = null;
      console.log('[YTM-RPC] (REMOVE) => Last Music ID:', lastMusicId);

      if (focusedTabId == lastTabId) return;
      
      focusedTabId = currentTabs[0].id;
      chrome.tabs.reload(focusedTabId);
      console.log('[YTM-RPC] (REMOVE) => Focused Tab ID:', focusedTabId);
    }
  });
});

chrome.webNavigation.onCommitted.addListener((data) => {
  if (!data.url.includes('music.youtube.com')) return;

  if (!focusedTabId) {
    focusedTabId = data.tabId;
    return console.log('[YTM-RPC] (REFRESH) => Focused Tab ID:', focusedTabId);
  }

  if (data.tabId != focusedTabId) return;
  socket.send(JSON.stringify({ action: 'removeRpc' }));
});

chrome.tabs.onCreated.addListener((tab) => {
  if (!tab.pendingUrl || !tab.pendingUrl.includes('music.youtube.com')) return;

  if (!focusedTabId) {
    focusedTabId = tab.id;
    return console.log('[YTM-RPC] (CREATE) => Focused Tab ID:', focusedTabId);
  }

  if (tab.id != focusedTabId) return;
});

const createWs = () => {
  socket = new WebSocket('ws://localhost:3000');

  socket.onclose = function (event) {
    if (event.wasClean) console.log('[YTM-RPC] (WEBSOCKET) => Connection closed.');
    else {
      console.log('[YTM-RPC] (WEBSOCKET) => Connection fucked.');
      setTimeout(createWs, 3000);
    }
  }

  socket.onopen = function () {
    console.log('[YTM-RPC] (WEBSOCKET) => Connected.')
  }

  socket.onerror = function (error) {
    console.log('[YTM-RPC] (WEBSOCKET) => Error:', error);
  }
}

chrome.webRequest.onCompleted.addListener(
  trackingInterception,
  { urls: ['https://music.youtube.com/*'] },
);

createWs();