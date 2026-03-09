//
//  index.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { sourceURL, urlSearchParams } from "./common/modules/constants.js";
import { formatVersionDate, getRecents, isValidHTTPURL, json, open, setRecents } from "./common/modules/utilities.js";
// import sources from "./common/assets/json/sources.json" assert { type: "json" }; // Doesn't work in Safari
// const { default: sources } = await import("./common/assets/json/sources.json", {assert: { type: "json" } }); // Broken on Safari 17.2
const sources = await json("./common/assets/json/sources.json");

let featuredSources = [];

(async function main() {
    // Fetch recents in parallel with featured, then render
    const recentUrls = getRecents();
    const [featuredResults, recentResults] = await Promise.all([
        Promise.allSettled(sources.map(url => fetchSource(url))),
        Promise.allSettled(recentUrls.map(url => fetchSource(url))),
    ]);

    featuredSources = featuredResults
        .filter(r => r.status === 'fulfilled' && r.value)
        .map(r => r.value);
    featuredSources.sort((a, b) => b.lastUpdated - a.lastUpdated);

    const recentSources = recentResults
        .filter(r => r.status === 'fulfilled' && r.value)
        .map(r => r.value);

    // Render recents
    if (recentSources.length > 0) {
        document.getElementById('recents').style.display = '';
        for (const source of recentSources) insertRecentSource(source);
    }

    // Render featured, excluding sources already in recents
    const recentUrlSet = new Set(recentUrls);
    for (const source of featuredSources) {
        if (!recentUrlSet.has(source.url)) insertFeaturedSource(source);
    }

    document.body.classList.remove("loading");
    document.getElementById("loading")?.remove();

    const textField = document.querySelector("input");
    const goButton = document.getElementById("go");
    const viewSource = () => {
        const sourceURL = textField.value;
        if (!isValidHTTPURL(sourceURL))
            alert("Invalid HTTP URL.");
        else open(`./view/?source=${sourceURL}`);
        // else insertSource(sourceURL, "afterbegin", true);
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

    window.onscroll = e => {
        const title = document.querySelector("h1");
        const navBar = document.getElementById("nav-bar");
        const navBarTitle = navBar.querySelector("#title");

        if (title.getBoundingClientRect().y < 24) {
            navBar.classList.remove("hide-border");
            navBarTitle.classList.remove("hidden");
        } else {
            navBar.classList.add("hide-border");
            navBarTitle.classList.add("hidden");
        }
    }
})();

async function fetchSource(url) {
    const source = await json(url);
    if (!source) return;
    source.lastUpdated = new Date("1970-01-01");
    source.appCount = 0;
    for (const app of source.apps) {
        if (app.beta || app.patreon?.hidden) return;
        let appVersionDate = new Date(app.versions ? app.versions[0].date : app.versionDate);
        if (appVersionDate > source.lastUpdated) {
            source.lastUpdated = appVersionDate;
            if (!source.iconURL)
                source.iconURL = app.iconURL;
            if (!source.tintColor)
                source.tintColor = app.tintColor;
        }
        source.appCount++;
    }
    if (!source.iconURL)
        source.iconURL = "./common/assets/img/generic_app.jpeg";
    if (!source.tintColor)
        source.tintColor = "var(--tint-color);";
    source.url = url;
    return source;
}

function insertRecentSource(source) {
    const wrapper = document.createElement('div');
    wrapper.className = 'swipe-row';
    const bgColor = source.tintColor
        ? `#${source.tintColor.replaceAll('#', '')}`
        : 'var(--tint-color)';
    wrapper.innerHTML = `
        <div class="source-container swipe-content">
            <a href="./view/?source=${source.url}" class="source-link">
                <div class="source" style="background-color: ${bgColor};">
                    <img src="${source.iconURL || './common/assets/img/generic_app.jpeg'}" alt="source-icon">
                    <div class="right">
                        <div class="text">
                            <p class="title">${source.name}</p>
                            <p class="subtitle">Last updated: ${formatVersionDate(source.lastUpdated)}</p>
                        </div>
                        <div class="app-count">
                            ${source.appCount} app${source.appCount === 1 ? '' : 's'}
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <button class="swipe-delete-btn" aria-label="Remove from recents"><i class="bi bi-trash-fill"></i></button>
    `;
    document.getElementById('recents').appendChild(wrapper);
    wrapper.querySelector('.swipe-delete-btn').addEventListener('click', () => removeRecentRow(wrapper, source.url));
    setUpSwipeToRemove(wrapper);
}

function insertFeaturedSource(source, position = "beforeend", flag = false) {
    document.getElementById("suggestions").insertAdjacentHTML(position, `
        <div class="source-container">
            <a href="./view/?source=${source.url}" class="source-link">
                <div class="source" style="
                    background-color: #${source.tintColor.replaceAll("#", "")};
                    margin-bottom: ${flag ? "0.75rem" : "0"};
                ">
                    <img src="${source.iconURL}" alt="source-icon">
                    <div class="right">
                        <div class="text">
                            <p class="title">${source.name}</p>
                            <p class="subtitle">Last updated: ${formatVersionDate(source.lastUpdated)}</p>
                        </div>
                        <div class="app-count">
                            ${source.appCount} app${source.appCount === 1 ? "" : "s"}
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `);
}

function setUpSwipeToRemove(row) {
    const content = row.querySelector('.swipe-content');
    const btn = row.querySelector('.swipe-delete-btn');
    const BTN_SNAP = 88;
    let startX = 0, startY = 0;
    let baseTranslate = 0;
    let horizontal = null;
    let tracking = false;
    let suppressNextClick = false;

    const setBtnTranslate = (cardX, transition) => {
        btn.style.transition = transition;
        btn.style.transform = `translateX(${BTN_SNAP + cardX}px)`;
    };

    setBtnTranslate(0, 'none');

    const snapTo = (x, animated = true) => {
        const t = animated ? 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
        content.style.transition = t;
        content.style.transform = x === 0 ? '' : `translateX(${x}px)`;
        setBtnTranslate(x, t);
        baseTranslate = x;
    };

    content.addEventListener('click', e => {
        if (suppressNextClick) {
            suppressNextClick = false;
            e.preventDefault();
            e.stopPropagation();
        }
    }, { capture: true });

    content.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        horizontal = null;
        tracking = false;
        content.style.transition = 'none';
        btn.style.transition = 'none';
    }, { passive: true });

    content.addEventListener('touchmove', e => {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        if (horizontal === null) {
            if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
            horizontal = Math.abs(dx) > Math.abs(dy);
        }
        if (!horizontal) return;
        e.preventDefault();
        tracking = true;
        const raw = Math.min(0, baseTranslate + dx);
        // Past the snap point: apply resistance so it slows down but doesn't hard-stop
        const translate = raw < -BTN_SNAP
            ? -(BTN_SNAP + (Math.abs(raw) - BTN_SNAP) * 0.3)
            : raw;
        content.style.transform = `translateX(${translate}px)`;
        setBtnTranslate(raw < -BTN_SNAP ? -BTN_SNAP : translate, 'none');
    }, { passive: false });

    content.addEventListener('touchend', e => {
        if (!tracking) {
            if (baseTranslate !== 0) {
                suppressNextClick = true;
                snapTo(0);
            }
            return;
        }
        tracking = false;
        const raw = Math.min(0, baseTranslate + (e.changedTouches[0].clientX - startX));
        snapTo(raw < -(BTN_SNAP / 2) ? -BTN_SNAP : 0);
    });
}

function removeRecentRow(row, url) {
    setRecents(getRecents().filter(r => r !== url));
    const content = row.querySelector('.swipe-content');
    const btn = row.querySelector('.swipe-delete-btn');
    btn.style.transition = 'opacity 0.18s ease';
    btn.style.opacity = '0';
    content.style.transition = 'transform 0.28s ease';
    content.style.transform = `translateX(-${row.offsetWidth}px)`;
    const height = row.offsetHeight;
    row.style.maxHeight = `${height}px`;
    row.style.transition = 'max-height 0.3s ease 0.15s, opacity 0.2s ease 0.15s';
    requestAnimationFrame(() => requestAnimationFrame(() => {
        row.style.maxHeight = '0';
        row.style.opacity = '0';
    }));
    setTimeout(() => {
        row.remove();
        if (!document.querySelector('#recents .swipe-row'))
            document.getElementById('recents').style.display = 'none';

        // Re-insert into featured if it's a known source
        const source = featuredSources.find(s => s.url === url);
        if (!source) return;

        const suggestionsEl = document.getElementById('suggestions');
        const containers = Array.from(suggestionsEl.querySelectorAll('.source-container'));
        const insertBefore = containers.find(el => {
            const title = el.querySelector('.title')?.textContent.trim();
            const match = featuredSources.find(s => s.name === title);
            return match && match.lastUpdated < source.lastUpdated;
        });

        const html = `
            <div class="source-container">
                <a href="./view/?source=${source.url}" class="source-link">
                    <div class="source" style="background-color: #${source.tintColor.replaceAll('#', '')};">
                        <img src="${source.iconURL}" alt="source-icon">
                        <div class="right">
                            <div class="text">
                                <p class="title">${source.name}</p>
                                <p class="subtitle">Last updated: ${formatVersionDate(source.lastUpdated)}</p>
                            </div>
                            <div class="app-count">
                                ${source.appCount} app${source.appCount === 1 ? '' : 's'}
                            </div>
                        </div>
                    </div>
                </a>
            </div>`;

        if (insertBefore) insertBefore.insertAdjacentHTML('beforebegin', html);
        else suggestionsEl.insertAdjacentHTML('beforeend', html);
    }, 450);
}