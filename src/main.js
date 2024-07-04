console.log("Hello, World!");

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

	// Create array from list
	let publicLinks;
	const publicLinksNewLines = list.value.split("\n").map((link) => link.trim());
	const publicLinksSpaces = list.value.split(" ").map((link) => link.trim());

	if (publicLinksNewLines.length > 1) {
		publicLinks = publicLinksNewLines;
	} else if (publicLinksSpaces.length > 0) {
		publicLinks = publicLinksSpaces;
	}

	// Generate result
	const resultLinks = publicLinks.map((link) => {
		let result = "";
		let key = "";

		// if target is empty
		if (target.value.length <= 0) return;

		// Get key from link
		if (link.startsWith("https://") || link.startsWith("http://")) {
			// Check if link start with https:// or http://
			const parts = link.split("/");
			// Check if parts length is greater than 3
			if (parts.length > 3) {
				const word = parts[3].split("?")[0]; // Extract the first word after the slash
				key = word;
			}
			// } else if (link.startsWith("t.me") || link.startsWith("vk.com")) {
		} else {
			// Check if link start with vk.com or t.me
			const parts = link.split("/");
			if (parts.length > 1) {
				const word = parts[1].split("?")[0]; // Extract the first word after the slash
				key = word;
			}
		}

		// If public link has key
		if (key.length > 0) {
			result += target.value;

			if (!target.value.endsWith("/") && !target.value.endsWith(".html")) result += "/";

			if (key) result += `?utm_source=${key}`;
			if (medium) result += `?utm_medium=${medium}`;
			if (campaign) result += `?utm_campaign=${campaign}`;
			if (content) result += `?utm_content=${content}`;
			if (term) result += `?utm_term=${term}`;
		}

		return result.trim();
	});

	// Clear result
	result.value = "";

	// Set result
	resultLinks.forEach((link, index) => {
		if (index === resultLinks.length - 1) {
			result.value += `${link}`;
		} else {
			result.value += `${link}\n`;
		}
		// auto_grow(result);
		auto_grow(result);
	});

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
