
'use strict';
// import firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyAjavFzLmOWGHKGOg7Hge2nTE0tAxN9h1Q",
    authDomain: "cloudproject-eaadc.firebaseapp.com",
    projectId: "cloudproject-eaadc",
    storageBucket: "cloudproject-eaadc.appspot.com",
    messagingSenderId: "172703707452",
    appId: "1:172703707452:web:9303f0e404517684086e39"
};

window.addEventListener("load", function () {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    updateUI(document.cookie);
    console.log("hello world load");

    // signup of a new user to firebase
    document.getElementById("sign-up").addEventListener('click', function () {
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // we have a created user
                const user = userCredential.user;

                // get the id token for the user who just logged in and force a redirect to /
                user.getIdToken().then((token) => {
                    document.cookie = "token=" + token + ";path=/;SameSite=Strict";
                    window.location = "/";
                });
            })
            .catch((error) => {
                // issue with signup that we will drop to console
                console.log(error.code + error.message);
                showAlert(error.message, 'danger');
            });
    });
});

// login of a user to firebase
document.getElementById("login").addEventListener('click', function () {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // we have a signed in user
            const user = userCredential.user;
            console.log("logged in");

            // get the id token for the user who just logged in and force a redirect to /
            user.getIdToken().then((token) => {
                document.cookie = "token=" + token + ";path=/;SameSite=Strict";
                window.location = "/";
            });
        })
        .catch((error) => {
            // issue with signin that we will drop to console
            console.log(error.code + error.message);
            showAlert(error.message, 'danger');
        });
});

// signout from firebase
document.getElementById("sign-out").addEventListener('click', function () {
    signOut(auth)
        .then((output) => {
            // remove the ID token for the user and force a redirect to /
            document.cookie = "token=;path=/;SameSite=Strict";
            window.location = "/";
        })
});

// function that will update the UI for the user depending on if they are logged in or not by checking the passed in cookie
// that contains the token
function updateUI(cookie) {
    var token = parseCookieToken(cookie);

    // if a user is logged in then disable the email, password, signup, and login UI elements and show the signout button and vice versa
    if (token.length > 0) {
        document.getElementById("login-box").hidden = true;
        document.getElementById("sign-out").hidden = false;
    } else {
        document.getElementById("login-box").hidden = false;
        document.getElementById("sign-out").hidden = true;
    }
}

// function that will take the cookie and will return the value associated with it to the caller
function parseCookieToken(cookie) {
    // split the cookie out on the basis of the semi colon
    var strings = cookie.split(';');

    // go through each of the strings
    for (let i = 0; i < strings.length; i++) {
        // split the string based on the = sign. if the LHS is token then return the RHS immediately
        var temp = strings[i].split('=');
        if (temp[0].trim() == "token")
            return temp[1];
    }


    return "";
}

function showAlert(message, type) {
    const alertPlaceholder = document.getElementById('alert-placeholder');
    const alert = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                   </div>`;
    alertPlaceholder.innerHTML = alert;
}


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


