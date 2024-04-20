//
//  index.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { urlSearchParams, sourceURL } from "./common/modules/constants.js";
import { isValidHTTPURL, open, formatVersionDate } from "./common/modules/utilities.js";
// import sources from "./common/assets/sources.json" assert { type: "json" }; // Doesn't work in Safari
// const { default: sources } = await import("./common/assets/sources.json", {assert: { type: "json" } }); // Broken on Safari 17.2
import { sources } from "./common/modules/constants.js";

(function main() {
    for (const url of sources)
        insertSource(url);

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

    async function insertSource(url, position = "beforeend", flag = false) {
        fetch(url).then(data => data.json()).then(source => {
            let lastUpdated = new Date("1970-01-01");
            let appCount = 0;
            let altSourceIcon = "./common/assets/img/generic_app.jpeg";
            let altSourceTintColor = "var(--altstore-tint-color);";
            for (const app of source.apps) {
                if (app.beta || app.patreon?.hidden) return;
                let appVersionDate = new Date(app.versions ? app.versions[0].date : app.versionDate);
                if (appVersionDate > lastUpdated) {
                    lastUpdated = appVersionDate;
                    altSourceIcon = app.iconURL;
                    if (app.tintColor) altSourceTintColor = app.tintColor;
                }
                appCount++;
            }

            document.getElementById("suggestions").insertAdjacentHTML(position,`
            <div class="source-container">
                <a href="./view/?source=${url}">
                    <div class="source" style="background-color: #${(source.tintColor ?? altSourceTintColor).replaceAll("#", "")}; ${flag ? "margin-bottom: 0.75rem;" : ""}">
                        <img src="${source.iconURL ?? altSourceIcon ?? "./common/assets/img/generic_app.jpeg"}" alt="source-icon">
                        <div class="right">
                            <div class="text">
                            <p class="title">${source.name}</p>
                            <p class="subtitle">Last updated: ${formatVersionDate(lastUpdated)}</p>
                            </div>
                            <div class="app-count">
                                ${appCount} ${appCount === 1 ? " app" : " apps"}
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            `);
        });
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