

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
                    <div class="flexjustify-center text-white text-lg">No images found</div>
                    `);
                } else {

                    response.forEach(url => {



                        // if url has word instagram , fb , facebook ,fbcdn.net/
                        if (url.includes('instagram') || url.includes('fb') || url.includes('facebook') || url.includes('fbcdn.net/')) {
                            url = "https://seep.eu.org/" + url;
                        }

                        $('#image-grid').append(`
                     <div class="border bg-gray-800 border-gray-300 rounded-lg shadow-2xl">
                <div class="flex flex-col justify-center items-center">
                    <div class="">
                        <a href="${url}" target="_blank">
                            <img src="${url}" alt="Image"
                                class="w-full h-auto max-h-16 bg-cover" crossorigin="anonymous">
                        </a>
                    </div>
                    <div class="flex justify-center my-2">
                        <button
                            class="bg-blue-500 text-white px-1 py-0.5 rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 mx-4">
                            <i class="fas fa-download text-xs"></i>
                        </button>
                        <button
                            class="bg-red-500 text-white px-1 py-0.5 rounded-md shadow-md hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105">
                            <i class="fas fa-trash-alt text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
                    
                    `);
                    });
                }
            }
            if (current_page == 'video') {
                $('#video-grid').empty();
                if (!response) {
                    $('#video-grid').append(`
                    <div class="flexjustify-center text-white text-lg">No videos found</div>
                    `);
                } else {
                    response.forEach(url => {
                        $('#video-grid').append(`
                        <div class="border bg-gray-800 border-gray-300 rounded-lg shadow-2xl">
                <div class="flex flex-col justify-center items-center">
                    <div class="">
                        <a href="${url}" target="_blank">
                            <video src="${url}" controls
                                class="w-full h-auto max-h-16 bg-cover"></video>
                        </a>
                    </div>
                    <div class="flex justify-center my-2">
                        <button
                            class="bg-blue-500 text-white px-1 py-0.5 rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 mx-4">
                            <i class="fas fa-download text-xs"></i>
                        </button>
                        <button
                            class="bg-red-500 text-white px-1 py-0.5 rounded-md shadow-md hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105">
                            <i class="fas fa-trash-alt text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
                     `)
                    });
                }
            }
            if (current_page == 'audio') {
                $('#audio-grid').empty();
                if (!response) {
                    $('#audio-grid').append(`
                    <div class="flexjustify-center text-white text-lg">No audios found</div>
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



    // send message to content script
});

