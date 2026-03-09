//
//  main.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { sourceURL, urlSearchParams } from "./constants.js";
import { getRecents, insertAltStoreBanner, isValidHTTPURL, open, setRecents, setTintColor, setUpBackButton } from "./utilities.js";

export function main(callback, fallbackURL = "../../") {
    // If no source
    if (!urlSearchParams.has('source')) {
        open(fallbackURL);
        return;
    }
    // If source is not a valid HTTP URL
    else if (!isValidHTTPURL(sourceURL)) {
        alert("Invalid HTTP URL.");
        open(fallbackURL);
        return;
    }

    var apps;
    window.setApps = array =>
        apps = array;
    window.getAppWithBundleId = bundleId =>
        apps?.find(app => app.bundleIdentifier == bundleId) ?? undefined;

    setUpBackButton();

    fetch(sourceURL)
        .then(response => response.json())
        .then(json => {
            // Set tint color
            const tintColor = json.tintColor?.replaceAll("#", "");
            if (tintColor) setTintColor(tintColor);

            // insertAltStoreBanner(json.name);

            setApps(json.apps);
            setRecents([sourceURL, ...getRecents().filter(u => u !== sourceURL)].slice(0, 10)); // Add to recents, ensuring no duplicates and max 10
            callback(json);
            // loaded();
            waitForAllImagesToLoad();
        })
        .catch(error => {
            alert(error);
            open(`${fallbackURL}?source=${sourceURL}`);
        });

    function waitForAllImagesToLoad() {
        const allImages = document.querySelectorAll("img");
        var count = 0;

        allImages.forEach(image => {
            // New img element that won't be rendered to the DOM
            var newImage = document.createElement("img");
            // Attach load listener
            newImage.addEventListener("load", imageLoaded);
            // Set src
            newImage.src = image.src;

            // Unable to load image
            image.addEventListener("error", (event) => {
                if (event.target.id == "app-icon") {
                    event.target.src = `${fallbackURL}common/assets/img/generic_app.jpeg`;
                } else event.target.remove()
                imageLoaded();
            });
        });

        function imageLoaded() {
            if (++count == allImages.length) loaded();
        }
    }

    function loaded() {
        document.querySelector("body").classList.remove("loading");
        document.getElementById("loading")?.remove();
    }
}
