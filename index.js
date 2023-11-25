//
//  index.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { urlSearchParams, sourceURL } from "./common/modules/constants.js";
import { isValidHTTPURL, open } from "./common/modules/utilities.js";
const { default: sources } = await import("./common/assets/sources.json", { assert: { type: "json" } });

(function main() {
    const textField = document.querySelector("input");
    
    for (const url of sources)
        insertSource(url);

    // If source provided
    if (urlSearchParams.has('source')) {
        textField.value = urlSearchParams.get("source");
        textField.focus();
    }

    textField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const sourceURL = textField.value;
            if (!isValidHTTPURL(sourceURL))
                alert("Invalid HTTP URL.");
            else open((`./view/?source=${sourceURL}`))
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