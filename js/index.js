const textField = document.querySelector("input");

textField.addEventListener("keypress", function (event) {
	// If the user presses the "Enter" key on the keyboard
	if (event.key === "Enter") {
		event.preventDefault();

		const url = textField.value;
		const urlRegex = /(https?:\/\/[^ ]*)/g;

		if (!url.match(urlRegex)) 
			alert("Invalid URL.");
		else 
			window.location.replace(`home.html?source=${url}`);
	}
});