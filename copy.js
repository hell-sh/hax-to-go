const input = document.querySelector("input")
input.value = decodeURIComponent(location.hash.replace("#", ""))
input.select()
if(document.execCommand("copy"))
{
	chrome.runtime.sendMessage({notification: "This website's link has successfully been shortened and copied."})
	window.close()
}
