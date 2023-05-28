const urlSearchParams = new URLSearchParams(window.location.search);
const sourceURL = urlSearchParams.get('source').replaceAll("+", "%2B");
// https://stackoverflow.com/a/8943487
const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

(function (global) {
    var apps;
    global.setApps = array => 
        apps = array;
    global.getAppWithBundleId = bundleId =>
        apps?.find(app => app.bundleIdentifier == bundleId) ?? undefined;

    setUpBackButton();
})(this);

const newsItemHTML = (news, minimal = false) => `
<div class="news-item-wrapper"> ${news.url ? 
    "<a href='" + news.url + "'>" : ""}
        <div class="item" style="background-color: #${news.tintColor};">
            <div class="text">
                <h3>${news.title}</h3>
                <p>${news.caption}</p>
            </div>${news.imageURL && !minimal ? 
            "<div class='image-wrapper'>" +
                "<img src='" + news.imageURL + "'>" +
            "</div>" : ""} 
        </div> ${news.url ? 
    "</a>" : ""} ${news.appID && !minimal ?  
    appHeaderHTML(getAppWithBundleId(news.appID)) ?? "" : ""}
</div>`;

const appHeaderHTML = app => app ? `
<div class="item">
    <div class="app-header">
        <div class="content">
            <img id="app-icon" src="${app.iconURL}" alt="">
            <div class="right">
                <div class="text">
                    <p class="title">${app.name}</p>
                    <p class="subtitle">${app.developerName}</p>
                </div>
                <a href="app.html?source=${sourceURL}&id=${app.bundleIdentifier}">
                    <button class="uibutton" style="background-color: #${app.tintColor};">View</button>
                </a>
            </div>
        </div>
        <div class="background" style="background-color: #${app.tintColor};"></div>
    </div>
</div>` : undefined;

function insertAddToAltStoreBanner(source) {
    document.getElementById("top")?.insertAdjacentHTML("afterbegin", `
    <div class="uibanner">
        <img src="https://user-images.githubusercontent.com/705880/65270980-1eb96f80-dad1-11e9-9367-78ccd25ceb02.png" alt="altstore-icon" class="icon">
        <div class="content">
            <div class="text-container">
                <p class="title-text">AltStore <span class="small beta badge"></span></p>
                <p class="detail-text">
                    Add ${source ? "\"" + source + "\"" : "this source"} to AltStore to receive app updates
                </p>
            </div>
            <a href="altstore://source?url=${sourceURL}">
                <button>Add</button>
            </a>
        </div>
    </div>`);
}

function insertNavigationBar(title) {
    document.getElementById("top")?.insertAdjacentHTML("beforeend", `
    <div id="nav-bar">
        <button id="back" type="button">
            <i class="bi bi-chevron-left"></i>
            Back
        </button>
        <div id="title">
            <p>${title ?? ""}</p>
        </div>
        <button id="back" class="hidden">
            <i class="bi bi-chevron-left"></i>
            Back
        </button>
    </div>`);
    setUpBackButton();
}

// https://stackoverflow.com/a/43467144/19227228
function isValidHTTPURL(string) {
    var url;
    try {
        url = new URL(string);
    } catch (error) {
        console.error("An error occurred.", error);
        return false;
    }
    return url.protocol == "http:" || url.protocol == "https:";
}

function formatString(string) {
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

function setTintColor(color) {
    document.querySelector(':root')?.style.setProperty("--accent-color", `#${color}`);
}

function setUpBackButton() {
    document.getElementById("back")?.addEventListener("click", () => history.back(1));
}

function search() {
    window.location.replace("search.html");
}

const $ = selector => selector.startsWith("#") && !selector.includes(".") && !selector.includes(" ")
    ? document.getElementById(selector.substring(1))
    : document.querySelectorAll(selector);