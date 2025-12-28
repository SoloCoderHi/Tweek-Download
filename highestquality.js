(() => {
  // Only run on X/Twitter
  if (
    window.location.href.includes("https://x.com") ||
    window.location.href.includes("https://twitter.com")
  ) {
    // Inject content script
    var script = document.createElement("script");
    script.src = chrome.runtime.getURL("content.js");
    (document.head || document.documentElement).appendChild(script);

    // Forward download requests from content.js to background script
    window.addEventListener("message", function (event) {
      if (event.source !== window) return;
      if (event.data && event.data.type === "DOWNLOAD_REQUEST") {
        chrome.runtime.sendMessage({
          action: "DOWNLOAD_BATCH",
          files: [{ url: event.data.url, filename: event.data.filename }],
        });
      }
    });
  }
})();
