//
//  utilities.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { AltStoreBanner } from "../components/AltStoreBanner.js";
import { NavigationBar } from "../components/NavigationBar.js";
import { urlRegex, sourceURL } from "./constants.js";

export function formatVersionDate(arg) {
    const versionDate = new Date(arg),
        month = versionDate.toLocaleString("default", { month: "short" }),
        date = versionDate.getDate();
    const today = new Date();
    const msPerDay = 60 * 60 * 24 * 1000;
    const msDifference = today.valueOf() - versionDate.valueOf();

    let dateString = versionDate.valueOf() ? `${month} ${date}, ${versionDate.getFullYear()}` : arg.split("T")[0];
    if (msDifference <= msPerDay && today.getDate() == versionDate.getDate())
        dateString = "Today";
    else if (msDifference <= msPerDay * 2)
        dateString = "Yesterday";

    return dateString;
}

export function insertSpaceInSnakeString(string) {
    return string.split(".").slice(-1)[0].split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export function insertSpaceInCamelString(string) {
    // https://stackoverflow.com/a/38388188/19227228
    return string.match(/[A-Z][a-z]+|[0-9]+/g).join(" ");
}

export function insertAltStoreBanner(sourceName) {
    document.getElementById("top")?.insertAdjacentHTML("afterbegin", AltStoreBanner(sourceName));
}

export function insertNavigationBar(title) {
    document.getElementById("top")?.insertAdjacentHTML("beforeend", NavigationBar(title));
    setUpBackButton();
}

// https://stackoverflow.com/a/43467144/19227228
export function isValidHTTPURL(string) {
    var url;
    try {
        url = new URL(string);
    } catch (error) {
        console.error("An error occurred.", error);
        return false;
    }
    return url.protocol == "http:" || url.protocol == "https:";
}

export function formatString(string) {
    if (!string) return undefined;

    // URLs
    const urlArray = string.match(urlRegex);
    // const urlSet = [...new Set(urlArray)]; // Converting to set to remove duplicates
    var result = "";
    urlArray?.forEach(url => {
        string = string.replace(url, `<a href="${url}">${url}</a>`)
        // Remove formatted substring so it won't get formatted again (prevents <a> tag within the href attribute another <a> tag)
        let endIndexOfClosingTag = string.indexOf("</a>") + 4;
        let formattedSubstring = string.substring(0, endIndexOfClosingTag);
        result += formattedSubstring;
        string = string.replace(formattedSubstring, "");
    });

    result += string;

    // New lines
    return result.replaceAll("\n", "<br>");
}

export function setTintColor(color) {
    document.querySelector(":root")?.style.setProperty("--tint-color", `#${color}`);
}

export function setUpBackButton() {
    document.getElementById("back")?.addEventListener("click", () => history.back());
}

export function open(url) {
    window.open(url, "_self");
}

const $ = selector => selector.startsWith("#") && !selector.includes(".") && !selector.includes(" ")
    ? document.getElementById(selector.substring(1))
    : document.querySelectorAll(selector);