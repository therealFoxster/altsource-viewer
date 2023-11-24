//
//  news.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { insertNavigationBar } from "../../common/modules/utilities.js";
import { NewsItem } from "../../common/components/NewsItem.js";
import { main } from "../../common/modules/main.js";

insertNavigationBar("All News");

main(json => {
    // Set tab title
    document.title = `News - ${json.name}`;

    // Sort news by latest
    json.news.sort((a, b) => (new Date(b.date)).valueOf() - (new Date(a.date)).valueOf());

    // Create & insert news items
    json.news.forEach(news => document.getElementById("news").insertAdjacentHTML("beforeend", NewsItem(news)));
});