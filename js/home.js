fetch(sourceURL)
	.then(response => response.json())
	.then(json => {
		document.querySelector("#news a").href = `news.html?source=${sourceURL}`;
		document.querySelector("#apps a").href = `apps.html?source=${sourceURL}`;

		if (json.tintColor) setTintColor(json.tintColor)

		document.title = json.name;
		document.getElementById("title").innerText = json.name;

		// Sort apps in descending order
		json.apps.sort((a, b) => {
			// If b < a
			return (new Date(b.versionDate)).valueOf() - (new Date(a.versionDate)).valueOf();
		});

		if (json.news && json.news.length >= 1) {
			// Sort news in decending order (latest first)
			json.news.sort((a, b) => (new Date(b.date)).valueOf() - (new Date(a.date)).valueOf());

			// News
			if (json.news.length == 1) {
				document.getElementById("news-items").insertAdjacentHTML("beforeend", newsItemHTML(json.news[0], json.apps, true));
				document.getElementById("news-items").classList.add("one");
			} else if (json.news.length > 1) {
				for (let i = 0; i < 5 && i < json.news.length; i++) {
					document.getElementById("news-items").insertAdjacentHTML("beforeend", newsItemHTML(json.news[i], json.apps, true));
				}
			}
		} else {
			document.getElementById("news").remove();
		}

		// Apps
		let count = 1;
		json.apps.forEach(app => {
			// Max: 3 featured apps if not specified
			if (count > 3) return;

			// Ignore beta apps
			if (app.beta) return;

			// If there are featured apps, ignore non-featured apps
			if (json.featuredApps && !json.featuredApps.includes(app.bundleIdentifier)) return;

			document.getElementById("apps").insertAdjacentHTML("beforeend", appHeaderHTML(app));

			count++;
		});

		var description = formatString(json.description);
		if (description) {
			document.getElementById("about").insertAdjacentHTML("beforeend", `
				<div class="item">
					<p>${description}</p>
				</div>
			`);
		} else {
			document.getElementById("about").remove();
		}

		waitForAllImagesToLoad();
	});
