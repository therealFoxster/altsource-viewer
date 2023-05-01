(function () {
	// If no source
	if (!urlSearchParams.has('source'))
		search();
	// If source is not a valid HTTP URL
	else if (!isValidHTTPURL(sourceURL)) {
		alert("Invalid HTTP URL.");
		search();
	} else insertAddToAltStoreBanner();
})();

fetch(sourceURL, {
	cache: "force-cache"
})
	.then(response => response.json())
	.then(json => {
		// Set tint color
		const tintColor = json.tintColor?.replaceAll("#", "");
		if (tintColor) setTintColor(tintColor);

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