// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

///////////////////////////////
// UI event handlers
///////////////////////////////
document.getElementById('clearState').addEventListener("click", clearState, false);
document.getElementById('getUser').addEventListener("click", getUser, false);
document.getElementById('removeUser').addEventListener("click", removeUser, false);
//document.getElementById('querySessionStatus').addEventListener("click", querySessionStatus, false);

//document.getElementById('startSigninMainWindow').addEventListener("click", startSigninMainWindow, false);
//document.getElementById('endSigninMainWindow').addEventListener("click", endSigninMainWindow, false);
//document.getElementById('startSigninMainWindowDiffCallbackPage').addEventListener("click", startSigninMainWindowDiffCallbackPage, false);

//document.getElementById('popupSignin').addEventListener("click", popupSignin, false);
document.getElementById('iframeSignin').addEventListener("click", iframeSignin, false);

//document.getElementById('startSignoutMainWindow').addEventListener("click", startSignoutMainWindow, false);
//document.getElementById('endSignoutMainWindow').addEventListener("click", endSignoutMainWindow, false);

//document.getElementById('popupSignout').addEventListener("click", popupSignout, false);

///////////////////////////////
// config
///////////////////////////////
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;
console.log("Using oidc-client version: ", Oidc.Version);

var url = location.href.substring(0, location.href.lastIndexOf('/'));

var settings = {
    authority: localStorage.getItem('cfg-authority'),
    client_id: localStorage.getItem('cfg-clientId'),
    //client_id: 'interactive.public.short',
    redirect_uri: location.href.split('?')[0],
    // post_logout_redirect_uri: url + '/code-identityserver-sample.html',
    response_type: 'code',
    //response_mode: 'fragment',
    scope: localStorage.getItem('cfg-scopes'),
    //scope: 'openid profile api offline_access',
    //popup_redirect_uri: url + '/code-identityserver-sample-popup-signin.html',
    //popup_post_logout_redirect_uri: url + '/code-identityserver-sample-popup-signout.html',
    //silent_redirect_uri: url + '/code-identityserver-sample-silent.html',
    automaticSilentRenew:false,
    validateSubOnSilentRenew: false,
    //silentRequestTimeout:10000,
    monitorAnonymousSession : false,
    filterProtocolClaims: false,
    monitorSession: false,
    loadUserInfo: false,
    revokeAccessTokenOnSignout : true,
    acr_values : localStorage.getItem('cfg-acr'),
    login_hint: localStorage.getItem('cfg-login'),
    extraTokenParams: { acr_values: localStorage.getItem('cfg-acr') }
};
var mgr = new Oidc.UserManager(settings);

///////////////////////////////
// events
///////////////////////////////
mgr.events.addAccessTokenExpiring(function () {
    console.log("token expiring");
    log("token expiring");

    // maybe do this code manually if automaticSilentRenew doesn't work for you
    mgr.signinSilent().then(function(user) {
        log("silent renew success", user);
    }).catch(function(e) {
        log("silent renew error", e.message);
    })
});

mgr.events.addAccessTokenExpired(function () {
    console.log("token expired");
    log("token expired");
});

mgr.events.addSilentRenewError(function (e) {
    console.log("silent renew error", e.message);
    log("silent renew error", e.message);
});

mgr.events.addUserLoaded(function (user) {
    console.log("user loaded", user);
    mgr.getUser().then(function(){
       console.log("getUser loaded user after userLoaded event fired"); 
    });
});

mgr.events.addUserUnloaded(function (e) {
    console.log("user unloaded");
});

mgr.events.addUserSignedIn(function (e) {
    log("user logged in to the token server");
});
mgr.events.addUserSignedOut(function (e) {
    log("user logged out of the token server");
});

///////////////////////////////
// functions for UI elements
///////////////////////////////
function clearState(){
    mgr.clearStaleState().then(function(){
        log("clearStateState success");
    }).catch(function(e){
        log("clearStateState error", e.message);
    });
}

function getUser() {
    mgr.getUser().then(function(user) {
        log("got user", user);
    }).catch(function(err) {
        log(err);
    });
}

function removeUser() {
    mgr.removeUser().then(function() {
        log("user removed");
    }).catch(function(err) {
        log(err);
    });
}

function startSigninMainWindow() {
    mgr.signinRedirect({useReplaceToNavigate:true}).then(function() {
        log("Redirecting to AdSTS...");
    }).catch(function(err) {
        log(err);
    });
}

function endSigninMainWindow() {
    log("Trying to exchange code for token...");
    mgr.signinCallback(settings).then(function(user) {
        log("signed in", user);
        log("Decoded access_token:", jwt_decode(user.access_token))
    }).catch(function(err) {
        log(err);
    });
}

function startSigninMainWindowDiffCallbackPage() {
    mgr.signinRedirect({state:'some data', redirect_uri: url + '/code-identityserver-sample-callback.html'}).then(function() {
        log("signinRedirect done");
    }).catch(function(err) {
        log(err);
    });
}

function popupSignin() {
    mgr.signinPopup({state:'some data'}).then(function(user) {
        log("Signed in with token:", user);
    }).catch(function(err) {
        log(err);
    });
}

function popupSignout() {
    mgr.signoutPopup({state:'some data'}).then(function() {
        log("signed out");
    }).catch(function(err) {
        log(err);
    });
}

function iframeSignin() {
    log("Trying to refresh token...");
    mgr.signinSilent(settings).then(function(user) {
        log("Refreshed token: ", user);
        log("Decoded refreshed access_token:", jwt_decode(user.access_token))
    }).catch(function(err) {
        log(err);
    });
}

function querySessionStatus() {
    mgr.querySessionStatus().then(function(status) {
        log("user's session status", status);
    }).catch(function(err) {
        log(err);
    });
}

function startSignoutMainWindow(){
    mgr.signoutRedirect({state:'some data'}).then(function(resp) {
    //mgr.signoutRedirect().then(function(resp) {
            log("signed out", resp);
    }).catch(function(err) {
        log(err);
    });
};

function endSignoutMainWindow(){
    mgr.signoutCallback().then(function(resp) {
        log("signed out", resp);
    }).catch(function(err) {
        log(err);
    });
};

if (location.search.includes("code=", 1)) {
    log("Response code was found in query!");
    endSigninMainWindow();
} else {
    log("Going to sign in using following configuration", settings);
    startSigninMainWindow();
}
