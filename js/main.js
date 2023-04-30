(function () {
	// If no source or source is not a URL
	if (!urlSearchParams.has('source') || !sourceURL.match(urlRegex))
		window.location.replace("index.html");
	insertAddToAltStoreBanner();
})()

fetch(sourceURL, {
	cache: "force-cache"
})
	.then(response => response.json())
	.then(json => {
		// Set tint color
		if (json.tintColor) setTintColor(json.tintColor);

		setApps(json.apps);
		main(json);
		waitForAllImagesToLoad();
	})
	.catch(error => console.error("An error occurred.", error));

function waitForAllImagesToLoad() {
	const allImages = document.querySelectorAll("img");
	var count = 0;

	allImages.forEach(image => {
		// New img element that won't be rendered to the DOM
		var newImage = document.createElement("img");
		// Attach load listener
		newImage.addEventListener("load", loaded);
		// Set src
		newImage.src = image.src;
	});

	function loaded() {
		if (++count == allImages.length) {
			document.querySelector("body").classList.remove("loading");
			document.getElementById("loading").remove();
		}
	}
}