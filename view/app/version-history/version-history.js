//
//  version-history.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { urlSearchParams, sourceURL } from "../../../common/modules/constants.js";
import { insertNavigationBar, formatVersionDate, formatString, open, setTintColor } from "../../../common/modules/utilities.js";
import { main } from "../../../common/modules/main.js";
import { MoreButton } from "../../../common/components/MoreButton.js";
import { VersionHistoryItem } from "../../../common/components/VersionHistoryItem.js";

const fallbackURL = `../../?source=${sourceURL}`;

if (!urlSearchParams.has('id')) open(fallbackURL);
const bundleId = urlSearchParams.get('id');

insertNavigationBar("Version History");

main(json => {
    const app = getAppWithBundleId(bundleId);
    if (!app) {
        open(fallbackURL);
        return;
    }

    // Set tab title
    document.title = `Version History - ${app.name}`;

    // Set tint color
    const tintColor = app.tintColor ? app.tintColor.replaceAll("#", "") : "var(--altstore-tint-color);";
    if (tintColor) setTintColor(tintColor);
    document.getElementById("back").style.color = tintColor;

    const versionsContainer = document.getElementById("versions");
    if (app.versions) {
        app.versions.forEach((version, i) => {
            versionsContainer.insertAdjacentHTML("beforeend",
                VersionHistoryItem(
                    version.version,
                    formatVersionDate(version.date),
                    formatString(version.localizedDescription),
                    version.downloadURL,
                    i
                )
            );
        });
    } else {
        versionsContainer.insertAdjacentHTML("beforeend",
            VersionHistoryItem(
                app.version,
                formatVersionDate(app.versionDate),
                formatString(app.versionDescription),
                app.downloadURL,
                0
            )
        );
    }

    document.querySelectorAll(".version-description").forEach(element => {
        if (element.scrollHeight > element.clientHeight)
            element.insertAdjacentHTML("beforeend", MoreButton(tintColor));
    });

    if (sourceURL?.includes("https://therealfoxster.github.io/altsource/apps.json"))
        document.querySelectorAll(".version-install").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                alert(`Direct installation is currently unavailable for "${json.name}".\nAdd this source to AltStore or manually download the IPA file to install.`);
            });
        });
}, "../../../");