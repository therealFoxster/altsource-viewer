const bundleId = urlSearchParams.get('id');
if (!urlSearchParams.has('id') || !bundleId) nope();

// Hide/show navigation bar title & install button
let hidden = false;
window.onscroll = function (e) {
	const appName = document.querySelector(".app-header .text>.title");
	const title = document.getElementById("title");
	const button = document.querySelector("#nav-bar .install");

	if (hidden && appName.getBoundingClientRect().y >= 72) { // App name not visible
		hidden = false;
		title.classList.add("hidden");
		button.classList.add("hidden");
		button.disaled = true;
	} else if (!hidden && appName.getBoundingClientRect().y < 72) {
		hidden = true;
		title.classList.remove("hidden");
		button.classList.remove("hidden");
		button.disaled = false;
	}
}

fetch(sourceURL)
	.then(response => response.json())
	.then(json => {
		const apps = json.apps.filter(app => app.bundleIdentifier === bundleId);
		const app = apps[0];
		if (!app) {
			alert(`Unable to find app matching bundle identifier "${bundleId}".\nYou will now be redirected to the home page.`);
			nope();
		}

		document.title = `${app.name} - ${json.name}`;

		const tintColor = `#${app.tintColor}`;

		if (tintColor)
			document.querySelector(':root').style.setProperty("--app-tint-color", `${tintColor}`);

		// Tint back button
		const backButton = document.getElementById("back");
		backButton.style.color = tintColor;

		const installButtons = document.querySelectorAll("a.install");
		installButtons.forEach(button => {
			button.href = `altstore://install?url=${app.downloadURL}`;
		});

		const downloadButton = document.getElementById("download");
		downloadButton.href = app.downloadURL;

		//
		// Navigation bar
		//
		const navBar = document.getElementById("nav-bar");
		const navBarIcon = navBar.querySelector("#title>img");
		const navBarTitle = navBar.querySelector("#title>p");
		const navBarInstallButton = navBar.querySelector(".uibutton");

		navBarTitle.textContent = app.name;
		navBarIcon.src = app.iconURL;
		navBarInstallButton.style.backgroundColor = `${tintColor}`;

		//
		// App header
		//
		const appHeader = document.querySelector("#main .app-header");
		const appHeaderIcon = appHeader.querySelector("img");
		const appHeaderTitle = appHeader.querySelector(".title");
		const appHeaderSubtitle = appHeader.querySelector(".subtitle");
		const appHeaderInstallButton = appHeader.querySelector(".uibutton");
		const appHeaderBackground = appHeader.querySelector(".background");

		appHeaderIcon.src = app.iconURL;
		appHeaderTitle.textContent = app.name;
		appHeaderSubtitle.textContent = app.developerName;
		appHeaderInstallButton.style.backgroundColor = tintColor;
		appHeaderBackground.style.backgroundColor = tintColor;

		// 
		// Preview
		// 
		const preview = document.getElementById("preview");
		const previewSubtitle = preview.querySelector("#subtitle");
		const previewScreenshots = preview.querySelector("#screenshots");
		const previewDescription = preview.querySelector("#description");

		previewSubtitle.textContent = app.subtitle;
		app.screenshotURLs.forEach(url => {
			previewScreenshots.insertAdjacentHTML("beforeend", `<img src="${url}" alt="">`);
		});

		previewDescription.innerHTML = formatString(app.localizedDescription);

		const more = `
		<a id="more" onclick="revealTruncatedText(this);">
			<button style="color: ${tintColor};">more</button>
		</a>`;

		if (previewDescription.scrollHeight > previewDescription.clientHeight)
			previewDescription.insertAdjacentHTML("beforeend", more);

		// 
		// Version info
		// 
		const versionDate = document.getElementById("version-date");
		const version = document.getElementById("version");
		const versionSize = document.getElementById("version-size");
		const versionDescription = document.getElementById("version-description");

		// Version date
		const versionDateObject = new Date(app.versionDate),
			month = versionDateObject.toUTCString().split(" ")[2],
			date = versionDateObject.getDate(),
			dateString = `${month} ${date}, ${versionDateObject.getFullYear()}`;
		const today = new Date();
		const msPerDay = 60 * 60 * 24 * 1000;
		const msDifference = today.valueOf() - versionDateObject.valueOf();
		versionDate.textContent = dateString;
		if (msDifference <= msPerDay) // Today
			versionDate.textContent = "Today";
		else if (msDifference <= msPerDay * 2) // Yesterday
			versionDate.textContent = "Yesterday";

		// Version number
		version.textContent = `Version ${app.version}`;

		// Version size
		const units = ["B", "KB", "MB", "GB"];
		var appSize = app.size, c = 0;
		while (appSize > 1024) {
			appSize = parseFloat(appSize / 1024).toFixed(1);
			c++;
		}
		versionSize.textContent = `${appSize} ${units[c]}`;

		// Version description
		versionDescription.innerHTML = formatString(app.versionDescription);
		if (versionDescription.scrollHeight > versionDescription.clientHeight)
			versionDescription.insertAdjacentHTML("beforeend", more);

		// 
		// Permissions
		// 
		const permissions = document.getElementById("permissions");

		if (app.permissions)
			permissions.querySelector(".permission").remove();

		app.permissions?.forEach(permission => {
			let permissionType = "Unknown", icon = "gear-wide-connected";
			switch (permission.type) {
				case "background-audio":
					permissionType = "Background Audio";
					// icon = "audio";
					icon = "volume-up-fill";
					break;
				case "background-fetch":
					permissionType = "Background Fetch";
					// icon = "fetch";
					icon = "arrow-repeat"
					break;
				case "photos":
					permissionType = "Photos"
					// icon = "photos";
					icon = "image-fill";
					break;
				default:
					break;
			}

			const html = `
			<div class="permission">
				<i class="bi-${icon}" style="color: ${tintColor};"></i>
				<div class="text">
					<p class="title">${permissionType}</p>
					<p class="description">${permission.usageDescription ?? "No description provided."}</p>
				</div>
			</div>`;

			permissions.insertAdjacentHTML("beforeend", html);
		});

		waitForAllImagesToLoad();
	});

function revealTruncatedText(moreButton) {
	const textId = moreButton.parentNode.id;
	const text = document.getElementById(textId);
	text.style.display = "block";
	text.style.overflow = "auto";
	text.style.webkitLineClamp = "none";
	text.style.lineClamp = "none";
	text.removeChild(moreButton)
}

function nope() {
	window.location.replace("index.html");
}