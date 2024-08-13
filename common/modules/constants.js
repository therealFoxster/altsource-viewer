//
//  constants.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

export const urlSearchParams = new URLSearchParams(window.location.search);

export const sourceURL = urlSearchParams.get('source')?.replaceAll("+", "%2B");

// https://stackoverflow.com/a/8943487
export const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;()]*[-A-Z0-9+&@#\/%=~_|)])/ig;