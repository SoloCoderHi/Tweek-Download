// Background script for X Media Downloader
// Handles download requests using chrome.downloads API

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "DOWNLOAD_BATCH") {
    message.files.forEach((file, index) => {
      downloadFile(file.url, file.filename, index);
    });
    sendResponse({ success: true });
  }
  return true;
});

function downloadFile(url, filename, index) {
  if (url.startsWith("blob:")) {
    console.error("Cannot download blob URL");
    return;
  }

  const uniqueName = createUniqueFilename(filename, index);

  chrome.downloads.download(
    {
      url: url,
      filename: "X_Downloads/" + uniqueName,
      conflictAction: "uniquify",
      saveAs: false,
    },
    (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("Download failed:", chrome.runtime.lastError.message);
      }
    }
  );
}

function createUniqueFilename(filename, index) {
  const parts = filename.split(".");
  const ext = parts.pop();
  const name = parts.join(".");
  return `${name}_${Date.now()}_${index}.${ext}`;
}
