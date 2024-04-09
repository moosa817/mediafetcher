# MEDIA FETCHER
#### Video Demo:  https://youtu.be/jSAG7U1pwuY
#### Description:
This Chrome extension, called "Media Fetcher," allows users to easily fetch images, videos, and audios from web pages. It achieves this by utilizing web requests and extracting the URLs of the media items that the user wants to fetch. With Media Fetcher, users can effortlessly retrieve media content from websites and enhance their browsing experience.

# Media Fetcher Chrome Extension

## Introduction
The Media Fetcher Chrome extension is designed to simplify the process of extracting media files such as images, videos, and audio files from web pages. It operates in the background using web requests to detect and retrieve these media elements, providing users with a convenient way to download them directly to their local system.

## Overview
This extension utilizes the `webRequest` API to intercept requests made by web pages, allowing it to identify and extract media files. Upon detecting media content, the extension initiates a download process, enabling users to save the media files effortlessly.

## Manifest File (manifest.json)
```json
{
    "name": "Media Fetcher",
    "description": "Fetches Images/Videos etc from page",
    "version": "1.0",
    "manifest_version": 3,
    "permissions": [
        "activeTab",
        "tabs",
        "webRequest",
        "downloads"
    ],
    "host_permissions": [
        "<all_urls>"
    ],
    "background": {
        "service_worker": "scripts/background.js"
    },
    "action": {
        "default_popup": "popup.html"
    },
    "icons": {
        "16": "images/icon-16.png",
        "32": "images/icon-32.png",
        "64": "images/icon-64.png",
        "128": "images/icon-128.png"
    },
    "content_scripts": [
        {
            "matches": [
                "<all_urls>"
            ],
            "js": [
                "scripts/content.js"
            ],
            "run_at": "document_end"
        }
    ]
}
```

### Manifest Details
- **name**: The name of the extension.
- **description**: Brief description of the extension's functionality.
- **version**: The version number of the extension.
- **manifest_version**: The version of the manifest file syntax.
- **permissions**: Permissions required by the extension, including access to active tabs, web requests, and downloads.
- **host_permissions**: Permissions granted to all URLs.
- **background**: Specifies the service worker script responsible for background tasks.
- **action**: Configuration for the extension's action, which in this case, refers to the popup interface.
- **icons**: Icons for different sizes used by the extension.
- **content_scripts**: Scripts injected into web pages to handle media extraction.

## Background Script (background.js)
This script runs in the background and handles web requests to detect media content.

This JavaScript code defines a functionality within the Media Fetcher Chrome extension. Here's what it does:

1. **`pageResources` Object**:
   - Initializes an object `pageResources` with empty properties for images, audio, and video files.

2. **`chrome.webRequest.onResponseStarted.addListener()`**:
   - Listens for responses from web requests.
   - When a response is received, it checks if the response type is either 'image' or 'media' (which typically encompasses audio and video files).
   - If it's an image or media file:
     - Determines the type of media (image, audio, or video) based on the file extension.
     - Stores the URL of the media file in the corresponding `pageResources` object under the current tab's ID.

3. **`chrome.runtime.onMessage.addListener()`**:
   - Listens for messages from other parts of the extension.
   - Handles different types of messages:
     - `'getResources'`: Retrieves the list of media resources for a specific page and type.
     - `'DeleteAllResources'`: Deletes all media resources for a specific page and type.
     - `'DeleteSingleResource'`: Deletes a specific media resource for a specific page and type.
     - `'DownloadAllResources'`: Initiates the download of all media resources.

4. **`chrome.tabs.onRemoved.addListener()`**:
   - Listens for when tabs are closed.
   - Upon tab removal, it clears the `pageResources` object for the corresponding tab ID, removing all stored media resources.

Overall, this code enables the extension to intercept web requests, identify media files, store their URLs, and provide functionalities to manage and download these media resources.


## Popup Interface (popup.html)
The popup interface allows users to interact with the extension and view downloaded media files.


The `popup.html` file is the interface users interact with when they click on the extension's icon. Here's what it does:

1. **Title and Styling**: Sets up the title and imports stylesheets for appearance.

2. **Buttons for Media Types**:
   - There are buttons for Images, Videos, and Audio files.
   - Clicking on any of these buttons will reveal a section below it.

3. **Media Sections**:
   - Each section contains:
     - A heading indicating the type of media files.
     - A "Fetch All" button to start fetching media files.
     - "Download All" and "Remove All" buttons for managing fetched media files.
     - An area where fetched media files will be displayed.

4. **JavaScript Dependencies**: Includes scripts necessary for the extension's functionality.

Overall, `popup.html` provides a user-friendly interface for users to fetch, download, and manage media files from web pages.

## popup.js
This JavaScript code is responsible for handling user interactions within the Media Fetcher Chrome extension's popup interface. Here's a breakdown:

1. **Fetching Media Resources**:
   - When the user clicks on the "Fetch All" button for a specific media type (image, video, or audio), it sends a message to the background script (`chrome.runtime.sendMessage`) requesting the list of resources for the current page and media type.
   - It then dynamically populates the interface with the fetched media resources.

2. **Removing All Resources**:
   - When the user clicks on the "Remove All" button for a specific media type, it sends a message to the background script to delete all resources of that type for the current page.
   - It also updates the interface to reflect the removal of resources.

3. **Removing Single Resource**:
   - When the user clicks on the "Remove" button for a specific media resource, it sends a message to the background script to delete that specific resource for the current page.
   - It removes the resource from the interface upon successful deletion.

4. **Downloading Single Resource**:
   - When the user clicks on the "Download" button for a specific media resource, it initiates the download of that resource using the `chrome.downloads.download` API.

5. **Utility Functions**:
   - `getFilenameFromUrl`: Extracts the filename from a URL and ensures it complies with filename conventions.
   - `DownloadZip`: Downloads multiple resources as a zip file.

Overall, this code provides functionality for fetching, managing, and downloading media resources from web pages through the extension's popup interface.

## Conclusion
The Media Fetcher Chrome extension provides a convenient solution for users to extract and download media files from web pages with ease. By leveraging the webRequest API and content scripts, it seamlessly integrates into the browsing experience, enhancing productivity and convenience for users.