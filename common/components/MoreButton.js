//
//  MoreButton.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

export const MoreButton = tintColor => `
<a id="more" onclick="revealTruncatedText(this);">
    <button style="color: ${tintColor};">more</button>
</a>`;

window.revealTruncatedText = moreButton => {
    const textId = moreButton.parentNode.id;
    const text = document.getElementById(textId);
    text.style.display = "block";
    text.style.overflow = "auto";
    text.style.webkitLineClamp = "none";
    text.style.lineClamp = "none";
    text.removeChild(moreButton)
};