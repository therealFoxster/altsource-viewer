//
//  search.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { urlSearchParams, sourceURL, isValidHTTPURL } from "./utilities.js";

(function main() {
    const success = url => window.location.replace(`index.html?source=${url}`);

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
})();