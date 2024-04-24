//
//  app.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { urlSearchParams, sourceURL } from "../../common/modules/constants.js";
import { formatString, insertSpaceInCamelString, insertSpaceInSnakeString, formatVersionDate, open, setTintColor, isValidHTTPURL } from "../../common/modules/utilities.js";
import { main } from "../../common/modules/main.js";
import { AppPermissionItem } from "../../common/components/AppPermissionItem.js";
import { privacy, entitlements, legacyPermissions } from "../../common/modules/constants.js";

// Dynamic imports (https://stackoverflow.com/a/76845572/19227228)
// Broken on Safari 17.2
// const { default: privacy } = await import("../../common/assets/privacy.json", { assert: { type: "json" } })
// const { default: entitlements } = await import("../../common/assets/entitlements.json", { assert: { type: "json" } })
// const { default: legacyPermissions } = await import("../../common/assets/legacy-permissions.json", { assert: { type: "json" } })

const fallbackURL = `../?source=${sourceURL}`;

if (!urlSearchParams.has('id')) open(fallbackURL);
const bundleId = urlSearchParams.get('id');

(function () {
    // Hide/show navigation bar title & install button
    let isNavigationBarItemsVisible = false;
    window.onscroll = function (e) {
        const appName = document.querySelector(".app-header .text>.title");
        const title = document.getElementById("title");
        const button = document.querySelector("#nav-bar .install");
        
        if (!isNavigationBarItemsVisible && appName.getBoundingClientRect().y < 100) {
            title.classList.remove("hidden");
            button.classList.remove("hidden");
            button.disaled = false;
            isNavigationBarItemsVisible = true;
        } else if (isNavigationBarItemsVisible && appName.getBoundingClientRect().y >= 100) { // Main app name is visible
            // Hide navigation bar title & install button
            title.classList.add("hidden");
            button.classList.add("hidden");
            button.disaled = true;
            isNavigationBarItemsVisible = false;
        }
    }
})();

main((json) => {
    const app = getAppWithBundleId(bundleId);
    if (!app) {
        open(fallbackURL);
        return;
    }

    // If has multiple versions, show the latest one
    if (app.versions) {
        const latestVersion = app.versions[0];
        app.version = latestVersion.version;
        app.versionDate = latestVersion.date;
        app.versionDescription = latestVersion.localizedDescription;
        app.downloadURL = latestVersion.downloadURL;
        app.size = latestVersion.size;
    }

    // Set tab title
    document.title = `${app.name} - ${json.name}`;

    const tintColor = app.tintColor ? app.tintColor.replaceAll("#", "") : "var(--tint-color);";
    // Set tint color
    if (tintColor) setTintColor(tintColor);

    // Set up install buttons
    document.querySelectorAll("a.install").forEach(button => {
        button.href = `altstore://install?url=${app.downloadURL}`;
        if (sourceURL?.includes("https://therealfoxster.github.io/altsource/apps.json"))
            button.addEventListener("click", event => {
                event.preventDefault();
                alert(`Direct installation is currently unavailable for "${json.name}".\nAdd this source to AltStore or manually download the IPA file to install.`);
            })
    });

    // Set up download button
    document.getElementById("download").href = app.downloadURL;

    // 
    // Navigation bar
    const navigationBar = document.getElementById("nav-bar");
    // Title
    navigationBar.querySelector("#title>p").textContent = app.name;
    // App icon
    navigationBar.querySelector("#title>img").src = app.iconURL;

    // 
    // App header
    const appHeader = document.querySelector("#main .app-header");
    // Icon
    appHeader.querySelector("img").src = app.iconURL;
    // App name
    appHeader.querySelector(".title").textContent = app.name;
    // Developer name
    appHeader.querySelector(".subtitle").textContent = app.developerName;

    const more = `
    <a id="more" onclick="revealTruncatedText(this);">
        <button>more</button>
    </a>`;

    window.revealTruncatedText = moreButton => {
        const textId = moreButton.parentNode.id;
        const text = document.getElementById(textId);
        text.style.display = "block";
        text.style.overflow = "auto";
        text.style.webkitLineClamp = "none";
        text.style.lineClamp = "none";
        text.removeChild(moreButton)
    }

    // 
    // Preview
    const preview = document.getElementById("preview");
    // Subtitle
    preview.querySelector("#subtitle").textContent = app.subtitle;
    // Screenshots
    // New
    app.screenshots?.forEach((screenshot, i) => {
        if (screenshot.imageURL)
            preview.querySelector("#screenshots").insertAdjacentHTML("beforeend", `
                <img src="${screenshot.imageURL}" alt="${app.name} screenshot ${i+1}" class="screenshot">
            `);
        else if (isValidHTTPURL(screenshot))
            preview.querySelector("#screenshots").insertAdjacentHTML("beforeend", `
                <img src="${screenshot}" alt="${app.name} screenshot ${i+1}" class="screenshot">
            `);
    }); 
    // Legacy
    app.screenshotURLs?.forEach((url, i) => {
        preview.querySelector("#screenshots").insertAdjacentHTML("beforeend", `<img src="${url}" alt="${app.name} screenshot ${i+1}" class="screenshot">`);
    });
    // Description
    const previewDescription = preview.querySelector("#description");
    previewDescription.innerHTML = formatString(app.localizedDescription);
    if (previewDescription.scrollHeight > previewDescription.clientHeight)
        previewDescription.insertAdjacentHTML("beforeend", more);

    // 
    // Version info
    const versionDateElement = document.getElementById("version-date");
    const versionNumberElement = document.getElementById("version");
    const versionSizeElement = document.getElementById("version-size");
    const versionDescriptionElement = document.getElementById("version-description");

    // Version date
    versionDateElement.textContent = formatVersionDate(app.versionDate);

    // Version number
    versionNumberElement.textContent = `Version ${app.version}`;

    // Version size
    const units = ["B", "KB", "MB", "GB"];
    var appSize = app.size, i = 0;
    while (appSize > 1024) {
        i++;
        appSize = parseFloat(appSize / 1024).toFixed(1);
    }
    // versionSizeElement.textContent = `${appSize} ${units[i]}`;

    // Version description
    versionDescriptionElement.innerHTML = formatString(app.versionDescription);
    if (versionDescriptionElement.scrollHeight > versionDescriptionElement.clientHeight)
        versionDescriptionElement.insertAdjacentHTML("beforeend", more);

    // Version history
    document.getElementById("version-history").href = `./version-history/?source=${sourceURL}&id=${app.bundleIdentifier}`;

    // 
    // Permissions

    // 
    // Privacy
    const privacyContainer = document.getElementById("privacy");
    if (app.appPermissions?.privacy?.length || app.permissions) {
        privacyContainer.querySelector(".permission-icon").classList = "permission-icon bi-person-fill-lock";
        privacyContainer.querySelector("b").innerText = "Privacy";
        privacyContainer.querySelector(".description").innerText = `"${app.name}" may request to access the following:`;
    }
    app.appPermissions?.privacy?.forEach(privacyPermission => {
        const permission = privacy[privacyPermission.name];
        let name = permission?.name ?? insertSpaceInCamelString(privacyPermission.name),
            icon;
        if (permission?.icon) icon = permission.icon;
        else icon = "gear-wide-connected";
        privacyContainer.querySelector(".permission-items").insertAdjacentHTML("beforeend",
            AppPermissionItem(name, icon, privacyPermission?.usageDescription)
        );
    });

    //
    // Legacy permissions
    if (!app.appPermissions?.privacy) {
        app.permissions?.forEach(appPermission => {
            const permission = legacyPermissions[appPermission.type];
            let name = insertSpaceInSnakeString(appPermission.type),
                icon;
            if (permission?.icon) icon = permission.icon;
            else icon = "gear-wide-connected";
            privacyContainer.querySelector(".permission-items").insertAdjacentHTML("beforeend",
                AppPermissionItem(name, icon, appPermission?.usageDescription)
            );
        });
    }

    //
    // Entitlements
    const entitlementsContainer = document.getElementById("entitlements");
    if (!app.appPermissions?.entitlements?.length) entitlementsContainer.remove();
    app.appPermissions?.entitlements.forEach(entitlementPermission => {
        const permission = entitlements[entitlementPermission.name];
        let name = permission?.name ?? insertSpaceInSnakeString(entitlementPermission.name),
            icon;
        if (permission?.icon) icon = permission.icon;
        else icon = "gear-wide-connected";;
        entitlementsContainer.querySelector(".permission-items").insertAdjacentHTML("beforeend",
            AppPermissionItem(name, icon, permission?.description)
        );
    });

    //
    // Source info
    const source = document.getElementById("source");
    const sourceA = source.querySelector("a");
    const sourceContainer = source.querySelector(".source");
    const sourceIcon = source.querySelector("img");
    const sourceTitle = source.querySelector(".title");
    const sourceSubtitle = source.querySelector(".subtitle");
    const sourceAppCount = source.querySelector(".app-count");

    let lastUpdated = new Date("1970-01-01");
    let appCount = 0;
    let altSourceIcon = "../../common/assets/img/generic_app.jpeg";
    let altSourceTintColor = "var(--altstore-tint-color);";
    for (const app of json.apps) {
        if (app.beta || app.patreon?.hidden) return;
        let appVersionDate = new Date(app.versions ? app.versions[0].date : app.versionDate);
        if (appVersionDate > lastUpdated) {
            lastUpdated = appVersionDate;
            altSourceIcon = app.iconURL;
            if (app.tintColor) altSourceTintColor = app.tintColor;
        }
        appCount++;
    }

    sourceA.href = `../../view/?source=${sourceURL}`;
    sourceContainer.style.backgroundColor = `#${(json.tintColor ?? altSourceTintColor).replaceAll("#", "")}`;
    sourceIcon.src = json.iconURL ?? altSourceIcon;
    sourceTitle.innerText = json.name;
    sourceContainer.href = `../?source=${sourceURL}`;
    sourceSubtitle.innerText = `Last updated: ${formatVersionDate(lastUpdated)}`;
    sourceAppCount.innerText = appCount + (appCount === 1 ? " app" : " apps");
});
