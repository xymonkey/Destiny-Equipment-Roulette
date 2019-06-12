var APIKey = "62f422f9869847708f9524db355258ef";
var clientID = 13464;
var authURL = "https://www.bungie.net/en/OAuth/Authorize?response_type=code&redirect_uri=https://xymonkey.github.io/Destiny-Equipment-Roulette/app.html&client_id=" + clientID;
var tokenURL = "https://www.bungie.net/Platform/App/OAuth/Token";
var accessTokenExpires;
var APIScope;
var urlParams;

(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

function authorize () {
	localStorage.setItem("BungieAPIState", "" + btoa(Math.random(new Date().getTime())));
	window.location = authURL +"&state=" + localStorage.getItem("BungieAPIState");
}

function postAuthorize ()
{
	$("#authorize-label").text ("Authorizing...");
	if (urlParams["state"] == localStorage.getItem("BungieAPIState"))
	{
		tokenURL+="client_id="+clientID+"&grant_type=authorization_code&code="+urlParams["code"];
		$.ajaxSetup({cache: false});
		$.ajax({
			processData: false,
			method: "POST",
			url: tokenURL,
			headers: {
				"Content-Type":"application/x-www-form-urlencoded",
				"X-API-Key":APIKey
			},
		}).done(function(json){
			localStorage.setItem("accessToken", json.responseJSON.accessToken.value);
			localStorage.setItem("refreshToken", json.responseJSON.refreshToken.value);
			localStorage.setItem("accessTokenExpires", json.responseJSON.accessToken.expires);
			//Make sure to check that the scope is correct for the api access we need to function.
			APIScope = json.responseJSON.scope;
			$("#authorize-label").text("Authorization complete");
		});
	}			
}

$(function(){
	if(urlParams["code"] && urlParams["state"] && urlParams["state"] == localStorage.getItem("BungieAPIState"))
	{
		console.log("post authorize");
		setTimeout(postAuthorize,5000);
	}
	$("#authorize-button").click(function(){authorize();});
});