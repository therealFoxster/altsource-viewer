(function main() {
	// If source specified, go straight to home page
	if (urlSearchParams.has('source') && sourceURL.match(urlRegex))
		window.location.replace(`home.html?source=${sourceURL}`);

	const textField = document.querySelector("input");
	textField.addEventListener("keypress", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();

			const url = textField.value;
			if (!url.match(urlRegex))
				alert("Invalid URL.");
			else window.location.replace(`home.html?source=${url}`);
		}
	});
})();