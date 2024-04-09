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

function getFilenameFromUrl(url) {
    // Extract the filename from the URL
    const parts = url.split('/');
    let filename = parts[parts.length - 1];
    // Remove anything that is not a letter
    filename = filename.replace(/[^a-zA-Z]/g, '');
    // Get the file extension using regex
    const extension = filename.match(/\.[0-9a-z]+$/i);
    // If the extension is not found, append a default extension

    // keep last 20 letters of filename
    filename = filename.slice(-20);

    const defaultExtension = 'jpg';
    return extension ? filename : filename + '.' + defaultExtension;
}

function DownloadZip(urls) {
    const zip = new JSZip();

    // Fetch each URL and add it to the zip file
    const promises = urls.map(url => {
        return fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const filename = getFilenameFromUrl(url);
                zip.file(filename, blob);
            });
    });

    // Wait for all fetch requests to complete
    return Promise.all(promises)
        .then(() => {
            // Generate the zip file
            return zip.generateAsync({ type: 'blob' });
        })
        .then(blob => {
            // Download the zip file
            const filename = 'download.zip';
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        });
}






$('.download-all').click(function () {
    $(this).text('Downloading...'); // Fix: Remove quotes around 'this'

    let urls = $(`#${current_page}-grid`).find('div').map(function () {
        return $(this).data('url');
    }).get();

    DownloadZip(urls)
});
