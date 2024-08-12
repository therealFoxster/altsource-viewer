// 
//  AppPermissionItem.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

import { showUIAlert } from "../modules/utilities.js";

window.showUIAlert = showUIAlert; 

export const AppPermissionItem = (name, icon, details) => `
<a class="permission-item" onclick='showUIAlert(
    "${name}",
    "${details?.replace(/(['"])/g, "\\$1") ?? "altsource-viewer does not have detailed information about this entitlement."}"
);'>
    <p><i class="bi-${icon}"></i></p>
    <p class="title">${name}</p>
</a>`;