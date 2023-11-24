//
//  NewsItem.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { AppHeader } from "./AppHeader.js";

export const NewsItem = (news, minimal = false) => `
<div class="news-item-wrapper"> ${news.url ?
    "<a href='" + news.url + "'>" : ""}
    <div class="item" style="background-color: #${news.tintColor.replaceAll("#", "")};">
        <div class="text">
            <h3>${news.title}</h3>
            <p>${news.caption}</p>
        </div>${news.imageURL && !minimal ?
    "<div class='image-wrapper'>" +
    "<img src='" + news.imageURL + "'>" +
    "</div>" : ""} 
    </div> ${news.url ?
    "</a>" : ""} ${news.appID && !minimal ?
        AppHeader(getAppWithBundleId(news.appID), "..") ?? "" : ""}
</div>`;