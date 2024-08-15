//
//  index.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { urlSearchParams, sourceURL } from "./common/modules/constants.js";
import { isValidHTTPURL, open, formatVersionDate, json } from "./common/modules/utilities.js";
// import sources from "./common/assets/json/sources.json" assert { type: "json" }; // Doesn't work in Safari
// const { default: sources } = await import("./common/assets/json/sources.json", {assert: { type: "json" } }); // Broken on Safari 17.2
const sources = await json("./common/assets/json/sources.json");

(async function main() {
    const fetchedSources = [];
    
    for (const url of sources) {
        const source = await fetchSource(url);
        fetchedSources.push(source);
    }

    // Sort sources by last updated
    fetchedSources.sort((a, b) => b.lastUpdated - a.lastUpdated);
    
    for (const source of fetchedSources) {
        await insertSource(source);
    }

    document.body.classList.remove("loading");
    document.getElementById("loading")?.remove();

    const textField = document.querySelector("input");
    const goButton = document.getElementById("go");
    const viewSource = () => {
        const sourceURL = textField.value;
        if (!isValidHTTPURL(sourceURL))
            alert("Invalid HTTP URL.");
        else open(`./view/?source=${sourceURL}`);
        // else insertSource(sourceURL, "afterbegin", true);
    };

    // If source provided
    if (urlSearchParams.has('source')) {
        textField.value = urlSearchParams.get("source");
        textField.focus();
    }

    textField.addEventListener("keypress", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            viewSource();
        }
    });

    const toggleGoButton = () => {
        if (textField.value.length) {
            goButton.style.display = "block";
            setTimeout(() => {
                goButton.style.opacity = 1;
            }, 5);
        } else {
            goButton.style.opacity = 0;
            setTimeout(() => {
                goButton.style.display = "none";
            }, 125);
        }
    }; toggleGoButton();
    textField.addEventListener("input", toggleGoButton);

    goButton.addEventListener("click", viewSource);

    async function fetchSource(url) {
        const source = await json(url);
        source.lastUpdated = new Date("1970-01-01");
        source.appCount = 0;
        for (const app of source.apps) {
            if (app.beta || app.patreon?.hidden) return;
            let appVersionDate = new Date(app.versions ? app.versions[0].date : app.versionDate);
            if (appVersionDate > source.lastUpdated) {
                source.lastUpdated = appVersionDate;
                if (!source.iconURL)
                    source.iconURL = app.iconURL;
                if (!source.tintColor)
                    source.tintColor = app.tintColor;
            }
            source.appCount++;
        }
        if (!source.iconURL)
            source.iconURL = "./common/assets/img/generic_app.jpeg";
        if (!source.tintColor)
            source.tintColor = "var(--tint-color);";
        source.url = url;
        return source;
    }

    async function insertSource(source, position = "beforeend", flag = false) {
        document.getElementById("suggestions").insertAdjacentHTML(position,`
            <div class="source-container">
                <a href="./view/?source=${source.url}" class="source-link">
                    <div class="source" style="
                        background-color: #${source.tintColor.replaceAll("#", "")};
                        margin-bottom: ${flag ? "0.75rem" : "0"};
                    ">
                        <img src="${source.iconURL}" alt="source-icon">
                        <div class="right">
                            <div class="text">
                                <p class="title">${source.name}</p>
                                <p class="subtitle">Last updated: ${formatVersionDate(source.lastUpdated)}</p>
                            </div>
                            <div class="app-count">
                                ${source.appCount} app${source.appCount === 1 ? "" : "s"}
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `);
    }

    window.onscroll = e => {
        const title = document.querySelector("h1");
        const navBar = document.getElementById("nav-bar");
        const navBarTitle = navBar.querySelector("#title");

        if (title.getBoundingClientRect().y < 32) {
            navBar.classList.remove("hide-border");
            navBarTitle.classList.remove("hidden");
        } else {
            navBar.classList.add("hide-border");
            navBarTitle.classList.add("hidden");
        }
    }
})();