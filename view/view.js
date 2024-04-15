//
//  view.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { sourceURL } from "../common/modules/constants.js";
import { formatString, open } from "../common/modules/utilities.js";
import { NewsItem } from "../common/components/NewsItem.js";
import { AppHeader } from "../common/components/AppHeader.js";
import { main } from "../common/modules/main.js";

main(json => {
    document.getElementById("edit").addEventListener("click", e => {
        e.preventDefault();
        open(`../?source=${sourceURL}`);
    });

    document.getElementById("add")?.addEventListener("click", e => {
        if (confirm(`Add "${json.name}" to Altstore?`))
            open(`altstore://source?url=${sourceURL}`);
    });

    // Set "View All News" link
    document.querySelector("#news a").href = `./news/?source=${sourceURL}`;
    // Set "View All Apps" link
    document.querySelector("#apps a").href = `./all-apps/?source=${sourceURL}`;

    // Set tab title
    document.title = json.name;
    // Set page title
    document.querySelector("h1").innerText = json.name;
    document.querySelector("#nav-bar #title>p").innerText = json.name;

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
    // json.apps.sort((a, b) => (new Date(b.versionDate)).valueOf() - (new Date(a.versionDate)).valueOf());

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
    if (json.website) document.getElementById("about").insertAdjacentHTML("beforeend", `
        <div class="item">
            <a href="${json.website}" target="_blank" rel="noopener noreferrer"><i class="bi bi-link-45deg"></i> ${json.website}</a>
        </div>
    `);
    if (!description && !json.website) document.getElementById("about").remove();

    window.onscroll = e => {
        const title = document.querySelector("h1");
        const navBar = document.getElementById("nav-bar");
        const navBarTitle = navBar.querySelector("#title");

        if (title.getBoundingClientRect().y < 85) {
            navBar.classList.remove("hide-border");
            navBarTitle.classList.remove("hidden");
        } else {
            navBar.classList.add("hide-border");
            navBarTitle.classList.add("hidden");
        }
    }
}, "../");