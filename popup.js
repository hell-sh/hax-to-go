chrome.tabs.query({
	active: true,
	currentWindow: true
}, tabs => {
	let src = "https://hax.to/"
	if(["http", "https"].indexOf(tabs[0].url.split(":")[0]) > -1)
	{
		src += "#target_link=" + encodeURIComponent(tabs[0].url)
	}
	document.querySelector("iframe").src = src
})
