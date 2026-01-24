//
//  all-apps.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { insertNavigationBar, processScreenshots } from "../../common/modules/utilities.js";
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

        const screenshotsHTML = processScreenshots(app, 2);
        if (screenshotsHTML) {
            html += `
            <div class="screenshots">
                ${screenshotsHTML}
            </div>`;
        }
        html += `
        </div>`;

        document.getElementById("apps").insertAdjacentHTML("beforeend", html);
    });
});
