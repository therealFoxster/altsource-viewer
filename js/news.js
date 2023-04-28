addNavigationBar("All News");

fetch(sourceURL)
	.then(response => response.json())
	.then(json => {
		if (json.tintColor) setTintColor(json.tintColor)

		document.title = `News - ${json.name}`;

		json.news.sort((a, b) => (new Date(b.date)).valueOf() - (new Date(a.date)).valueOf());
		json.news.forEach(news =>
			document.getElementById("news").insertAdjacentHTML("beforeend", newsItemHTML(news, json.apps))
		);

		waitForAllImagesToLoad();
	});