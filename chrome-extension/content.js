const sliderListener = () => {
  const targetElement = document.querySelector('#progress-bar.ytmusic-player-bar');

  if (targetElement) {
    const progressElement = targetElement.querySelector('tp-yt-paper-progress');

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-valuenow') {
          const now = mutation.target.getAttribute('aria-valuenow');
          const max = mutation.target.getAttribute('aria-valuemax');
          
          chrome.runtime.sendMessage({ action: 'updateRpc', now, max });
          break;
        }
      }
    });

    observer.observe(progressElement, { attributes: true });
  }
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action == 'sliderListener') sliderListener();
});