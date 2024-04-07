let pageResources = {
    image: {},
    audio: {},
    video: {}
};

chrome.webRequest.onCompleted.addListener(
    function (details) {
        if (details.type === 'image' || details.type === 'audio' || details.type === 'video') {
            const pageUrl = details.tabId;
            if (!pageResources[details.type][pageUrl]) {
                pageResources[details.type][pageUrl] = [];
            }
            if (!pageResources[details.type][pageUrl].includes(details.url)) {
                pageResources[details.type][pageUrl].push(details.url);
            }
        }
    },
    { urls: ["<all_urls>"] }
);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === 'getImageUrls') {
            const pageUrl = request.pageUrl;
            const type = request.type;
            sendResponse(pageResources[type][pageUrl]);
        }
    }
);

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    const pageUrl = tabId;
    if (pageResources.image[pageUrl]) {
        delete pageResources.image[pageUrl];
    }
    if (pageResources.audio[pageUrl]) {
        delete pageResources.audio[pageUrl];
    }
    if (pageResources.video[pageUrl]) {
        delete pageResources.video[pageUrl];
    }
});
