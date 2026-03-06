//
//  view.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { AppHeader } from "../common/components/AppHeader.js";
import { NewsItem } from "../common/components/NewsItem.js";
import { sourceURL } from "../common/modules/constants.js";
import { main } from "../common/modules/main.js";
import { formatString, open, showUIAlert } from "../common/modules/utilities.js";

function tintWithOpacity(hexColor, alpha = 0.2) {
    const normalizedAlpha = Math.min(Math.max(alpha, 0), 1);
    const transparentPercent = Math.round((1 - normalizedAlpha) * 100);
    const sanitized = (hexColor ?? "").replaceAll("#", "").trim();
    const hex = sanitized.length === 3
        ? sanitized.split("").map(char => `${char}${char}`).join("")
        : sanitized.slice(0, 6);
    const value = Number.parseInt(hex, 16);

    if (Number.isNaN(value)) {
        return `color-mix(in srgb, var(--color-primary), transparent ${transparentPercent}%)`;
    }

    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;

    return `rgba(${r}, ${g}, ${b}, ${normalizedAlpha})`;
}

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

    document.getElementById("news").insertAdjacentHTML("beforebegin", `
        <div class="item source-url-copy-row" style="--source-chip-bg: ${tintWithOpacity(json.tintColor, 0.35)};">
                <button id="copy-source-url" type="button" title="${sourceURL}" class="source-url-copy-button">
                    <span class="source-url-copy-text">${sourceURL}</span>
                    <i class="bi bi-copy source-url-copy-icon"></i>
            </button>
        </div>
    `);

    document.getElementById("copy-source-url")?.addEventListener("click", async () => {
        try {
            if (!navigator.clipboard?.writeText) {
                showUIAlert("Copy Failed", "Clipboard is not supported in this browser.");
                return;
            }

            await navigator.clipboard.writeText(sourceURL);
            showUIAlert("Copied", "Source URL copied to clipboard.");
        } catch {
            showUIAlert("Copy Failed", "Unable to copy source URL.");
        }
    });

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
    if (json.featuredApps) {
        json.apps
            .filter(app => json.featuredApps.includes(app.bundleIdentifier))
            .forEach(app => document.getElementById("apps").insertAdjacentHTML("beforeend", AppHeader(app)));
    } else {
        let count = 1;
        json.apps.forEach(app => {
            // Max: 5 featured apps if not specified
            if (count > 5) return;
    
            // Ignore beta apps
            if (app.beta) return;
    
            document.getElementById("apps").insertAdjacentHTML("beforeend", AppHeader(app));
    
            count++;
        });
    }

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

        if (title.getBoundingClientRect().y < 24) {
            navBar.classList.remove("hide-border");
            navBarTitle.classList.remove("hidden");
        } else {
            navBar.classList.add("hide-border");
            navBarTitle.classList.add("hidden");
        }
    }
}, "../");