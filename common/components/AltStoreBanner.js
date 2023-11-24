//
//  AltStoreBanner.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { sourceURL } from "../modules/constants.js";

export const AltStoreBanner = (sourceName) => `
<div class="uibanner">
    <img src="https://user-images.githubusercontent.com/705880/65270980-1eb96f80-dad1-11e9-9367-78ccd25ceb02.png" alt="altstore-icon" class="icon">
    <div class="content">
        <div class="text-container">
            <p class="title-text">AltStore <span class="small beta badge"></span></p>
            <p class="detail-text">
                Add ${sourceName ? "\"" + sourceName + "\"" : "this source"} to AltStore to receive app updates
            </p>
        </div>
        <a href="altstore://source?url=${sourceURL}">
            <button>Add</button>
        </a>
    </div>
</div>`;