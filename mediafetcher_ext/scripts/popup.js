$('.fetch-btn').click(function () {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        const tabId = activeTab.id;

        chrome.runtime.sendMessage({ message: 'getImageUrls', pageUrl: tabId, type: current_page }, function (response) {
            if (current_page == 'image') {
                $('#image-grid').empty();
                if (!response) {
                    $('#image-grid').append(`
                    <div class="text-center text-white text-lg">No images found</div>
                    `);
                } else {

                    response.forEach(url => {
                        $('#image-grid').append(`
                     <div class="border bg-gray-800 border-gray-300 rounded-lg shadow-2xl">
                <div class="flex flex-col justify-center items-center">
                    <div class="">
                        <a href="${url}" target="_blank">
                            <img src="${url}" alt="Image"
                                class="w-full h-auto max-h-16 bg-cover">
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

        });
    });



    // send message to content script
});

