let pageResources = {
    image: {},
    audio: {},
    video: {}
};


chrome.webRequest.onResponseStarted.addListener(
    function (details) {
        if (details.type === 'image' || details.type === 'media') {


            const pageUrl = details.tabId;
            let mytype;
            if (details.type === 'media') {
                if (details.url.includes('.mp3')) {
                    mytype = 'audio';
                }
                else { mytype = 'video'; }
            } else {
                mytype = 'image';
            }


            if (!pageResources[mytype][pageUrl]) {
                pageResources[mytype][pageUrl] = [];
            }
            if (!pageResources[mytype][pageUrl].includes(details.url)) {
                pageResources[mytype][pageUrl].push(details.url);
            }
        }
    },
    { urls: ["<all_urls>"] }
);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === 'getResources') {
            const pageUrl = request.pageUrl;
            const type = request.type;
            sendResponse(pageResources[type][pageUrl]);
        }


        if (request.message === 'DeleteAllResources') {
            const pageUrl = request.pageUrl;
            const type = request.type;
            pageResources[type][pageUrl] = [];
            sendResponse(true);
        }

        if (request.message === 'DeleteSingleResource') {
            const pageUrl = request.pageUrl;
            const type = request.type;
            const url = request.url;
            const index = pageResources[type][pageUrl].indexOf(url);
            if (index > -1) {
                pageResources[type][pageUrl].splice(index, 1);
            }
            sendResponse(true);
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
