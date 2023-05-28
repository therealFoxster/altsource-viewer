insertNavigationBar("All Apps");

function main(json) {
    // Set tab title
    document.title = `Apps - ${json.name}`;

    // Sort apps in decending order of version date (newest first)
    json.apps.sort((a, b) => (new Date(b.versionDate)).valueOf() - (new Date(a.versionDate)).valueOf());

    // Create & insert app items
    json.apps.forEach(app => {
        if (app.beta) return; // Ignore beta apps

        let html = `
        <div class="app-container">
            ${appHeaderHTML(app) }
            <p style="text-align: center; font-size: 0.9em;">${app.subtitle ?? ""}</p>`;
        if (app.screenshotURLs) {
            html += `
            <div class="screenshots">`;
            for (let i = 0; i < app.screenshotURLs.length, i < 2; i++) if (app.screenshotURLs[i]) html += `
                <img src="${app.screenshotURLs[i]}" class="screenshot">`;
            html += `
            </div>`;
        }
        html += `
        </div>`;

        document.getElementById("apps").insertAdjacentHTML("beforeend", html);
    });
}