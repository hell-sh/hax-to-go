// Copyright (c) 2016-19 Hell.sh

var activeNotification;

chrome.notifications.onClicked.addListener(id => chrome.notifications.clear(id))
chrome.notifications.onClosed.addListener(() => activeNotification = undefined)

const showNotification = text => {
	if(activeNotification)
	{
		chrome.notifications.clear(activeNotification)
	}
	activeNotification = chrome.notifications.create({
		type: "basic",
		iconUrl: "/icon.png",
		title: chrome.app.getDetails().name,
		message: text
	}, id => activeNotification = id)
},
shortenURL = url => new Promise((resolve, reject) => {
	const protocol = url.split(":")[0]
	if(["http", "https"].indexOf(protocol) == -1)
	{
		reject("Sorry, " + protocol + "://-links are not supported.")
	}
	else
	{
		reject("Successfully failed.");
	}
})

chrome.runtime.onMessage.addListener((req, sender, respond) => {
	if("shorten_url" in req)
	{
		const protocol = req.shorten_url.split(":")[0]
		console.log("shorten", req.shorten_url)
		if(["http", "https"].indexOf(protocol) == -1)
		{
			showNotification("Sorry, " + protocol + "://-links are not supported.")
		}
		else
		{
			respond(req.shorten_url)
		}
	}
	else if("notification" in req)
	{
		showNotification(req.notification)
	}
	else
	{
		console.error("Can't handle request:",req)
	}
})

chrome.commands.onCommand.addListener(command => {
	if(command == "shorten")
	{
		chrome.tabs.getSelected(null, tab => {
			shortenURL(tab.url).then(url => {
				console.log("short url:",url)
			}).catch(showNotification)
		})
	}
})
