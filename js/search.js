(function main() {
	const success = url => window.location.replace(`${window.location.host}?source=${url}`);

	// If valid source provided
	if (urlSearchParams.has('source') && isValidHTTPURL(sourceURL))
		success(sourceURL);

	const textField = document.querySelector("input");
	textField.addEventListener("keypress", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();

			const url = textField.value;
			if (!isValidHTTPURL(url))
				alert("Invalid HTTP URL.");
			else success(url);
		}
	});
})();