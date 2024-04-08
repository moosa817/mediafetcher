$('.fetch-btn').click(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        const tabId = activeTab.id;
        const originUrl = new URL(activeTab.url).origin;
        chrome.runtime.sendMessage({ message: 'getResources', pageUrl: tabId, type: current_page }, function (response) {
            if (current_page == 'image') {
                $('#image-grid').empty();
                if (!response) {
                    $('#image-grid').append(`
                        <div class="flex justify-center font-extrabold text-white text-lg">No images found, Try to reload page</div>
                    `);
                } else {
                    if (response.length == 0) {
                        $('#image-grid').append(`
                            <div class="flex justify-center font-extrabold text-white text-lg">No images found, Try to reload page</div>
                        `);
                    }
                    let index = 0;
                    response.forEach(url => {
                        if (url.includes('instagram') || url.includes('fb') || url.includes('facebook') || url.includes('fbcdn.net/')) {
                            url = "https://seep.eu.org/" + url;
                        }
                        $('#image-grid').append(`
                            <div id="image-${index}" data-url="${url}" class="border bg-gray-800 border-gray-300 rounded-lg shadow-2xl" style="position: relative;">
                                <div class="flex flex-col justify-center items-center">
                                    <div class="">
                                        <a href="${url}" target="_blank">
                                            <img src="${url}" alt="Image" class="w-full h-auto bg-cover" crossorigin="anonymous">
                                        </a>
                                    </div>
                                    <div class="flex justify-center my-2" style="position: absolute; top: 0; right: 0;">
                                        <button data-index="${index}" class="download-single bg-blue-500 text-white px-1 py-0.5 rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 mx-4">
                                            <i class="fas fa-download text-xs"></i>
                                        </button>
                                        <button data-index="${index}" class="remove-single bg-red-500 text-white px-1 py-0.5 rounded-md shadow-md hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105">
                                            <i class="fas fa-trash-alt text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `);
                        index++;
                    });
                }
            }
            if (current_page == 'video') {
                $('#video-grid').empty();
                if (!response) {
                    $('#video-grid').append(`
                        <div class="flex justify-center text-white text-lg">No videos found</div>
                    `);
                } else {
                    let index = 0;
                    response.forEach(url => {
                        $('#video-grid').append(`
                            <div id="video-${index}" data-url="${url}" class="border bg-gray-800 border-gray-300 rounded-lg shadow-2xl">
                                <div class="flex flex-col justify-center items-center">
                                    <div class="">
                                        <a href="${url}" target="_blank">
                                            <video src="${url}" controls class="w-full h-auto max-h-16 bg-cover"></video>
                                        </a>
                                    </div>
                                    <div class="flex justify-center my-2">
                                        <button data-index="${index}" class="download-single bg-blue-500 text-white px-1 py-0.5 rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 mx-4">
                                            <i class="fas fa-download text-xs"></i>
                                        </button>
                                        <button data-index="${index}" class="remove-single bg-red-500 text-white px-1 py-0.5 rounded-md shadow-md hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105">
                                            <i class="fas fa-trash-alt text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `);
                        index++;
                    });
                }
            }
            if (current_page == 'audio') {
                $('#audio-grid').empty();
                if (!response) {
                    $('#audio-grid').append(`
                        <div class="flex justify-center text-white text-lg">No audios found</div>
                    `);
                } else {
                    response.forEach(url => {
                        $('#audio-grid').append(`
                            <div>
                                <audio src="${url}" controls class="w-48 h-10 bg-cover"></audio>
                            </div>
                        `);
                    });
                }
            }
        });
    });
});

$('.remove-all').click(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        const tabId = activeTab.id;
        chrome.runtime.sendMessage({ message: 'DeleteAllResources', pageUrl: tabId, type: current_page }, function (response) {
            $(`#${current_page}-grid`).empty();
        });
    });
});

$('body').on('click', '.remove-single', function () {
    let indexremove = $(this).data('index');
    let id = `#${current_page}-${indexremove}`;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        const tabId = activeTab.id;
        chrome.runtime.sendMessage({ message: 'DeleteSingleResource', pageUrl: tabId, type: current_page, url: $(id).data('url') }, function (response) {
            $(id).fadeOut();
            $(id).remove();
        });
    });
});

$('body').on('click', '.download-single', function () {
    let indexdownload = $(this).data('index');
    let id = `#${current_page}-${indexdownload}`;
    chrome.downloads.download({
        url: $(id).data('url')
    }, function (downloadId) {
        if (downloadId) {
            // Handle download success
        } else {
            // Handle download failure
        }
    });
});

$('.download-all').click(function () {
    let urls = $(`#${current_page}-grid`).find('div').map(function () {
        return $(this).data('url');
    });
    urls.each(function (index, url) {
        chrome.downloads.download({
            url: url
        }, function (downloadId) {
            if (downloadId) {
                // Handle download success
            } else {
                // Handle download failure
            }
        });
    });
});
