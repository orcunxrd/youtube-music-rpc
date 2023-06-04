console.log('[YTM-RPC] (CONTENT) => Oluşturuldu.');
let sliderListener = null;

const createSliderListener = () => {
  const progressBar = document.querySelector('#progress-bar');
  if (!progressBar) return sliderListener = null;

  let prevNow = null;
  let idleTimer = null;

  const observer = new MutationObserver((mutationsList) => {
    clearTimeout(idleTimer);

    idleTimer = setTimeout(() => {
      console.log('[YTM-RPC] (SLIDER) => Timer tetiklendi.');
      chrome.runtime.sendMessage({ listener: 'updateRpc', action: 'idle' });
    }, 3000);

    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'aria-valuenow') {
        const now = mutation.target.getAttribute('aria-valuenow');
        const max = mutation.target.getAttribute('aria-valuemax');

        if (now !== prevNow) {
          console.log('[YTM-RPC] (SLIDER) =>', now, max);
          chrome.runtime.sendMessage({ listener: 'updateRpc', action: 'listening', now, max });
          prevNow = now;
          prevMax = max;
        }
      }
    }
  });

  observer.observe(progressBar, { attributes: true });
};

const initializeSliderListener = () => {
  if (!sliderListener)
    sliderListener = createSliderListener();
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'sliderListener')
    initializeSliderListener();
});
