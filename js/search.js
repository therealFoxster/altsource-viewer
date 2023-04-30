(function main() {
	const success = url => {
		const host = window.location.host;
		var path = window.location.pathname.split("/")[1];
		path = path?.trim === "" ? "" : `/${path}`;
		window.location.replace(`${host}${path}?source=${url}`
	)};

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