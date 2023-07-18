//
//  index.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { sourceURL, formatString } from "./utilities.js";
import { NewsItem } from "./components/NewsItem.js";
import { AppHeader } from "./components/AppHeader.js";
import { main } from "./main.js";

main((json) => {
    // Set "View All News" link
    document.querySelector("#news a").href = `news.html?source=${sourceURL}`;
    // Set "View All Apps" link
    document.querySelector("#apps a").href = `apps.html?source=${sourceURL}`;

    // Set tab title
    document.title = json.name;
    // Set page title
    document.getElementById("title").innerText = json.name;

    // 
    // News
    if (json.news && json.news.length >= 1) {
        // Sort news in decending order of date (latest first)
        json.news.sort((a, b) => // If b < a
            (new Date(b.date)).valueOf() - (new Date(a.date)).valueOf());

        if (json.news.length == 1) {
            document.getElementById("news-items").insertAdjacentHTML("beforeend", NewsItem(json.news[0], true));
            document.getElementById("news-items").classList.add("one");
        } else for (let i = 0; i < 5 && i < json.news.length; i++)
            document.getElementById("news-items").insertAdjacentHTML("beforeend", NewsItem(json.news[i], true));
    } else document.getElementById("news").remove();

    // Sort apps in descending order of version date
    json.apps.sort((a, b) => (new Date(b.versionDate)).valueOf() - (new Date(a.versionDate)).valueOf());

    // 
    // Featured apps
    let count = 1;
    json.apps.forEach(app => {
        // Max: 5 featured apps if not specified
        if (count > 5) return;

        // Ignore beta apps
        if (app.beta) return;

        // If there are featured apps, ignore non-featured apps
        if (json.featuredApps && !json.featuredApps.includes(app.bundleIdentifier)) return;

        document.getElementById("apps").insertAdjacentHTML("beforeend", AppHeader(app));

        count++;
    });

    // 
    // About
    var description = formatString(json.description);
    if (description) document.getElementById("about").insertAdjacentHTML("beforeend", `
        <div class="item">
            <p>${description}</p>
        </div>
    `);
    else document.getElementById("about").remove();
});