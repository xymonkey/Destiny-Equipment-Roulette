var APIKey = "62f422f9869847708f9524db355258ef";
var clientID = 13464;
var authURL = "https://www.bungie.net/en/OAuth/Authorize?response_type=code&client_id=" + clientID;
var tokenURL = "https://www.bungie.net/Platform/App/GetAccessTokensFromCode/";
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
	console.log(localStorage.getItem("BungieAPIState"));
	window.location = authURL +"&state=" + localStorage.getItem("BungieAPIState");
}

function postAuthorize ()
{
	$("#authorize-label").text ("Authorizing...");
	if (urlParams["state"] == localStorage.getItem("BungieAPIState"))
	{
		$.ajax({
			contentType:"application/json; charset=UTF-8;",
			method: "POST",
			url: tokenURL,
			headers: {
				"X-API-Key": APIKey,
			},
			data: {"code": urlParams["code"]}
		}).done(function(json){
			console.log(json.responseJSON);
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
		postAuthorize ();
	}
	$("#authorize-button").click(function(){authorize();});
});