//
//  index.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { urlSearchParams, sourceURL } from "./common/modules/constants.js";
import { isValidHTTPURL, open } from "./common/modules/utilities.js";
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

    async function insertSource(url) {
        fetch(url).then(data => data.json()).then(source => {
            document.getElementById("source-code").insertAdjacentHTML("beforebegin",`
                <a href="./view/?source=${url}">
                    <div class="suggestion">
                    <i class="bi bi-search"></i>
                    ${source.name}
                    </div>
                </a>`
            );
        });
    }
})();