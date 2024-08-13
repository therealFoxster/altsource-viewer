// 
//  AppPermissionItem.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { showUIAlert } from "../modules/utilities.js";

window.showUIAlert = showUIAlert;

export const AppPermissionItem = (id, name, icon) => `
<a id="${id}" class="permission-item">
    <p><i class="bi-${icon}"></i></p>
    <p class="title">${name}</p>
</a>`;