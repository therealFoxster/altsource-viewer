//
//  VersionHistoryItem.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

export const VersionHistoryItem = (number, date, description, url, i) => `
<div class="version">
    <div class="version-header">
        <p class="version-number">${number}</p>
        <p class="version-date">${date}</p>
    </div>
    <div class="version-options">
        <a class="version-install" href="altstore://install?url=${url}">Install with AltStore</a>
        <a class="version-download" href="${url}">Download IPA</a>
    </div>
    <p class="version-description" id="description${i}">${description}</p>
</div>`;