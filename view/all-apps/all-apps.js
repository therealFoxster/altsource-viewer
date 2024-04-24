//
//  all-apps.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { insertNavigationBar, isValidHTTPURL } from "../../common/modules/utilities.js";
import { AppHeader } from "../../common/components/AppHeader.js";
import { main } from "../../common/modules/main.js";

insertNavigationBar("All Apps");

main((json) => {
    // Set tab title
    document.title = `Apps - ${json.name}`;

    // Sort apps in decending order of version date (newest first)
    // json.apps.sort((a, b) => (new Date(b.versionDate)).valueOf() - (new Date(a.versionDate)).valueOf());

    // Create & insert app items
    json.apps.forEach(app => {
        if (app.beta) return; // Ignore beta apps

        let html = `
        <div class="app-container">
            ${AppHeader(app, "..")}
            <p style="text-align: center; font-size: 0.9em;">${app.subtitle ?? ""}</p>`;
        if (app.screenshots) { // New
            html += `
            <div class="screenshots">`;
            for (let i = 0; i < app.screenshots.length, i < 2; i++) {
                const screenshot = app.screenshots[i];
                if (!screenshot) return;
                if (screenshot.imageURL) html += `
                <img src="${screenshot.imageURL}" class="screenshot">`;
                else if (isValidHTTPURL(screenshot)) html += `
                <img src="${screenshot}" class="screenshot">`;
            }
            html += `
            </div>`;
        } else if (app.screenshotURLs) { // Legacy
            html += `
            <div class="screenshots">`;
            for (let i = 0; i < app.screenshotURLs.length, i < 2; i++) if (app.screenshotURLs[i]) html += `
                <img src="${app.screenshotURLs[i]}" class="screenshot">`;
            html += `
            </div>`;
        }
        html += `
        </div>`;

        document.getElementById("apps").insertAdjacentHTML("beforeend", html);
    });
});