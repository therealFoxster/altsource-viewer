insertNavigationBar("All News");

function main(json) {
	// Set tab title
	document.title = `News - ${json.name}`;

	// Sort news by latest
	json.news.sort((a, b) => (new Date(b.date)).valueOf() - (new Date(a.date)).valueOf());

	// Create & insert news items
	json.news.forEach(news => document.getElementById("news").insertAdjacentHTML("beforeend", newsItemHTML(news)));
}