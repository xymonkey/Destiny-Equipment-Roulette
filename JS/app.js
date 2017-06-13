var APIKey = "62f422f9869847708f9524db355258ef";
var clientID = 13464;
var authURL = "https://www.bungie.net/en/OAuth/Authorize";
var tokenURL = "https://www.bungie.net/Platform/App/GetAccessTokensFromCode/";
var accessTokenExpires;
var APIScope;

function authorize () {
	localStorage.setItem("BungieAPIState", "" + btoa(Math.random(new Date().getTime())));
	console.log(localStorage.getItem("BungieAPIState"));
	$.ajax({
		url: authURL,
		headers: {
			"X-API-Key": APIKey,
			"state": localStorage.getItem("BungieAPIState")
		}
	}).done(function(json){
		console.log(json.Response);
		var code = json.Response.data.code;
		var state = json.Response.data.state;
		if (state == localStorage.getItem("BungieAPIState"))
		{
			$.ajax({
				method: "POST",
				url: tokenURL,
				headers: {
					"X-API-Key": APIKey,
				},
				data: {
					"code": code,
				}
			}).done(function(json){
				console.log(json.Response);
				localStorage.setItem("accessToken", json.Response.accessToken.value);
				localStorage.setItem("refreshToken", json.Response.refreshToken.value);
				localStorage.setItem("accessTokenExpires", json.Response.accessToken.expires);
				//Make sure to check that the scope is correct for the api access we need to function.
				APIScope = json.Response.scope;
			});
		}			
		console.log(json.Response.headers.state);
	});
}

$(function(){
	$("#authorize-button").click(function(){authorize();});
});