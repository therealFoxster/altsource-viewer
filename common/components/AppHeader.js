//
//  AppHeader.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { sourceURL } from "../modules/constants.js";

export const AppHeader = (app, x = ".") => app ? `
<div class="item">
    <div class="app-header">
        <div class="content">
            <img id="app-icon" src="${app.iconURL}" alt="">
            <div class="right">
                <div class="text">
                    <p class="title">${app.name}</p>
                    <p class="subtitle">${app.developerName}</p>
                </div>
                <a href="${x}/app/?source=${sourceURL}&id=${app.bundleIdentifier}">
                    <button class="uibutton" style="background-color: #${app.tintColor.replaceAll("#", "")};">View</button>
                </a>
            </div>
        </div>
        <div class="background" style="background-color: #${app.tintColor.replaceAll("#", "")};"></div>
    </div>
</div>` : undefined;