//
//  versionHistory.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { urlSearchParams } from "./constants.js";
import { insertNavigationBar, exit, formatVersionDate, formatString } from "./utilities.js";
import { main } from "./main.js";
import { MoreButton } from "./components/MoreButton.js";
import { VersionHistoryItem } from "./components/VersionHistoryItem.js";

if (!urlSearchParams.has('id')) exit();
const bundleId = urlSearchParams.get('id');

insertNavigationBar("Version History");

main((json) => {
    const app = getAppWithBundleId(bundleId);
    console.log(app.versions);

    // Set tab title
    document.title = `Version History - ${app.name}`;

    // Set tint color
    const tintColor = `#${app.tintColor?.replaceAll("#", "")}`;
    if (tintColor) document.querySelector(':root').style.setProperty("--app-tint-color", `${tintColor}`);
    document.getElementById("back").style.color = tintColor;

    const versionsContainer = document.getElementById("versions");
    if (app.versions) {
        app.versions.forEach((version, i) => {
            versionsContainer.insertAdjacentHTML("beforeend", VersionHistoryItem(version.version, formatVersionDate(version.date), formatString(version.localizedDescription), version.downloadURL, i))
        });
    } else {
        versionsContainer.insertAdjacentHTML("beforeend", VersionHistoryItem(app.version, formatVersionDate(app.versionDate), formatString(app.versionDescription), app.downloadURL, 0))
    }

    document.querySelectorAll(".version-description").forEach(element => {
        console.log(MoreButton(tintColor));
        if (element.scrollHeight > element.clientHeight)
            element.insertAdjacentHTML("beforeend", MoreButton(tintColor));
    });
});