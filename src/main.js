console.log("Author - https://romon.io?utm_source=utm_multiliner");

window.auto_grow = (element, anotherElement) => {
	if (anotherElement) {
		return (element.style.height = anotherElement.scrollHeight + "px");
	}
	element.style.height = element.scrollHeight + "px";
};

// Event listeners
get().generate.addEventListener("click", generate);
get().reset.addEventListener("click", reset);
window.get = get();

// Get inputs
function get() {
	const ids = ["target_url", "utm_medium", "utm_term", "utm_campaign", "utm_content", "list", "result", "generate", "reset"];
	const elements = ids.map((id) => document.getElementById(id));
	const getElement = (id) => elements.find((el) => el.id === id);
	const getValue = (id) => elements.find((el) => el.id === id)?.value;

	return {
		target: getElement("target_url"),
		medium: getValue("utm_medium"),
		term: getValue("utm_term"),
		campaign: getValue("utm_campaign"),
		content: getValue("utm_content"),
		list: getElement("list"),
		result: getElement("result"),
		generate: getElement("generate"),
		reset: getElement("reset"),
	};
}

// Generate result
function generate() {
	const { target, medium, term, campaign, content, list, result } = get();

	// if target is empty
	if (target.value.length <= 0) return;

	// Clear result
	result.value = "";

	// Create array from list
	let publicLinks;
	const publicLinksNewLines = list.value
		.trim()
		.split("\n")
		.map((link) => link.trim());
	const publicLinksSpaces = list.value
		.trim()
		.split(" ")
		.map((link) => link.trim());

	if (publicLinksNewLines.length > 1) {
		publicLinks = publicLinksNewLines.filter(function (line) {
			return line.length < 1 ? false : true;
		});
	} else if (publicLinksSpaces.length > 0) {
		publicLinks = publicLinksSpaces.filter(function (line) {
			return line.length < 1 ? false : true;
		});
	}

	// Generate result
	const resultLinks = publicLinks.map((link) => {
		let result = "";
		let source = "";

		// Get source from link
		if (link.startsWith("https://") || link.startsWith("http://")) {
			// Check if link start with https:// or http://
			const parts = link.split("/");
			// Check if parts length is greater than 3
			if (parts.length > 3) {
				const word = parts[3].split("?")[0]; // Extract the first word after the slash
				source = word;
			}
			// } else if (link.startsWith("t.me") || link.startsWith("vk.com")) {
		} else if (link.split("/").length > 1) {
			// Check if link start with vk.com or t.me
			const parts = link.split("/");
			if (parts.length > 1) {
				const word = parts[1].split("?")[0]; // Extract the first word after the slash
				source = word;
			}
		} else {
			source = link;
		}

		// Add target URL to result
		result += target.value;

		// Add slash if not exists
		if (!target.value.endsWith("/") && !target.value.endsWith(".html")) result += "/";

		// Create utm params
		let isFirstUtmAdded = false;
		let utmParams = {
			utm_source: source,
			utm_medium: medium,
			utm_campaign: campaign,
			utm_content: content,
			utm_term: term,
		};

		// Add utm params
		for (const [param, value] of Object.entries(utmParams)) {
			if (value) {
				result += isFirstUtmAdded ? `&${param}=${value}` : `?${param}=${value}`;
				isFirstUtmAdded = true;
			}
		}

		return result.trim();
	});

	// If public links is empty
	if (resultLinks.length === 0) {
		let oneLine = "";
		// Add target URL to result
		oneLine += target.value;

		// Add slash if not exists
		if (!target.value.endsWith("/") && !target.value.endsWith(".html")) oneLine += "/";

		// Create utm params
		let isFirstUtmAdded = false;
		let utmParams = {
			utm_medium: medium,
			utm_campaign: campaign,
			utm_content: content,
			utm_term: term,
		};

		// Add utm params
		for (const [param, value] of Object.entries(utmParams)) {
			if (value) {
				oneLine += isFirstUtmAdded ? `&${param}=${value}` : `?${param}=${value}`;
				isFirstUtmAdded = true;
			}
		}

		oneLine.trim();
		result.value = oneLine;
		auto_grow(result);
	} else {
		// Add result
		resultLinks.forEach((link, index) => {
			if (index === resultLinks.length - 1) {
				result.value += `${link}`;
			} else {
				result.value += `${link}\n`;
			}
			auto_grow(result);
		});
	}

	// Set width
	result.style.width = result.scrollWidth + "px";
}

function reset() {
	const confirm = window.confirm("Сбросить ссылки и результат?", "Сбросить");
	if (confirm) {
		const { list, result } = get();
		list.value = "";
		result.value = "";
	}
}

// DEBUG
// get().target.value = `https://redevents.ru/event/46-orkestr.html`;
// get().list.value = `
// https://vk.com
// https://t.me
// https://vk.com/
// https://t.me/
// https://vk.com/?query=result
// https://t.me/?query=result
// https://vk.com/liveroman
// https://t.me/liveroman
// https://vk.com/liveroman/
// https://t.me/liveroman/
// t.me/liveroman/
// t.me/liveroman
// vk.com/liveroman/
// vk.com/liveroman
// https://vk.com/liveroman/?query=result
// https://t.me/liveroman/?query=result
// `.trim();
// auto_grow(get().list);
