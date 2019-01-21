// Copyright (c) 2016-19 Hell.sh

var activeNotification, notificationTimer
chrome.notifications.onClicked.addListener(id => chrome.notifications.clear(id))
chrome.notifications.onClosed.addListener(() => activeNotification = null)
const showNotification = text => {
	if(activeNotification)
	{
		chrome.notifications.clear(activeNotification)
	}
	clearTimeout(notificationTimer)
	activeNotification = chrome.notifications.create({
		type: "basic",
		iconUrl: "/icon/128.png",
		title: chrome.app.getDetails().name,
		message: text,
		silent: true
	}, id => {
		activeNotification = id
		notificationTimer = setTimeout(() => {
			if(activeNotification)
			{
				chrome.notifications.clear(activeNotification)
				activeNotification = null
			}
		}, 3000)
	})
}
chrome.runtime.onMessageExternal.addListener((req, sender, respond) => {
	if(req.get_version)
	{
		respond({version: chrome.app.getDetails().version})
	}
	else
	{
		console.error("Invalid request:", req)
	}
})
chrome.runtime.onMessage.addListener((req, sender, respond) => {
	if(req.notification)
	{
		showNotification(req.notification)
	}
	else
	{
		console.error("Invalid request:", req)
	}
})
chrome.commands.onCommand.addListener(command => {
	if(command == "shorten")
	{
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, tabs => {
			if(["http", "https"].indexOf(tabs[0].url.split(":")[0]) == -1)
			{
				showNotification("Sorry, " + tabs[0].url.split(":")[0] + ":// links are not supported.")
			}
			else
			{
				showNotification("Shortening link...")
				var xhr = new XMLHttpRequest()
				xhr.addEventListener("load", () => {
					var json = JSON.parse(xhr.responseText)
					if(json.id)
					{
						window.open(chrome.runtime.getURL("/copy.html#") + encodeURIComponent("https://hax.to/" + json.id))
					}
					else if(json.error)
					{
						showNotification(json.error)
					}
					else
					{
						showNotification("An unknown error occured.")
					}
				})
				xhr.open("POST", "https://hax.to/shorten")
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
				xhr.send("link=" + encodeURIComponent(tabs[0].url))
			}
		})
	}
})
