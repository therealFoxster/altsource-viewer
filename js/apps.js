addNavigationBar("All Apps");

fetch(sourceURL)
	.then(response => response.json())
	.then(json => {
		if (json.tintColor) setTintColor(json.tintColor)

		document.title = `Apps - ${json.name}`;

		json.apps.sort((a, b) => (new Date(b.versionDate)).valueOf() - (new Date(a.versionDate)).valueOf());
		json.apps.forEach(app => {
			if (app.beta) return; // Ignore beta apps

			const urls = app.screenshotURLs;

			let html = `
			<div class="app-container">`;
			html +=
				appHeaderHTML(app);
			html += `
				<p style="text-align: center; font-size: 0.9em;">${app.subtitle ?? ""}</p>`;
			if (urls) {
				html += `
				<div class="screenshots">`;
				for (let i = 0; i < urls.length, i < 2; i++) html += `
					<img src="${urls[i]}" class="screenshot">`;
				html += `
				</div>`;
			}
			html += `
			</div>`;

			document.getElementById("apps").insertAdjacentHTML("beforeend", html);
		});

		waitForAllImagesToLoad();
	});