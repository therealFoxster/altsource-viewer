//
//  index.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { urlSearchParams, sourceURL } from "./common/modules/constants.js";
import { isValidHTTPURL } from "./common/modules/utilities.js";
const { default: sources } = await import("./common/assets/sources.json", { assert: { type: "json" } });

(function main() {
    const success = url => window.location.replace(`./view/?source=${url}`);

    for (const url of sources) {
        insertSource(url);
    }

    // If valid source provided
    if (urlSearchParams.has('source') && isValidHTTPURL(sourceURL))
        success(sourceURL);

    const textField = document.querySelector("input");
    textField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();

            const url = textField.value;
            if (!isValidHTTPURL(url))
                alert("Invalid HTTP URL.");
            else success(url);
        }
    });

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