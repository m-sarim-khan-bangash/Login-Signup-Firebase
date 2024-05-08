import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAlezvT4DMLAt6dieRfAvnXNoAvWWeRoP0",
  authDomain: "jawan-pakistan-c6bdb.firebaseapp.com",
  projectId: "jawan-pakistan-c6bdb",
  storageBucket: "jawan-pakistan-c6bdb.appspot.com",
  messagingSenderId: "318827079649",
  appId: "1:318827079649:web:c3f187635dbdb82c8854a0",
  measurementId: "G-NSEWWBRS2Z",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();

// *******************************Signup********************************
let signupBtn = document.getElementById("signupBtn");

if (signupBtn) {
  signupBtn.addEventListener("click", signup);
}

function signup() {
  var emailInput = document.getElementById("email");
  var passwordInput = document.getElementById("password");

  createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const userData = {
        email: emailInput.value,
        password: passwordInput.value,
      };

      // Set user data in the database
      set(ref(db, "users/" + user.uid), userData)
        .then(() => {
          console.log("User data saved successfully:", userData);
          alert("User registered successfully!");
          window.location = "login.html";
        })
        .catch((error) => {
          console.error("Error saving user data:", error);
          // Handle error if needed
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Signup error:", errorMessage, errorCode);
      // Handle error if needed
    });
}

// **********************************Login********************************
let loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", login);
}

function login() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      onValue(ref(db, "users/" + user.uid), (snapshot) => {
        const data = snapshot.val();
        console.log(data);
      });
      console.log(user);
      alert("User logged in successfully!");
      window.location = "home.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      console.log(errorCode);
    });
}

// ************************************Check user login status********************************
let userName = document.getElementById("userName");
let userEmail = document.getElementById("userEmail");

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in", user);
    userName.innerHTML = user.email.slice(0, user.email.indexOf("@"));
    userEmail.innerHTML = user.email;

    if (location.pathname == "/login.html") {
      window.location = "home.html";
    }
  } else {
    console.log("User is logged out");
    if (location.pathname == "/home.html") {
      window.location = "login.html";
    }
  }
});

// ***************************************Change Icon********************************
let changeIcon = document.getElementById("changeIcon");

if (changeIcon) {
  changeIcon.addEventListener("click", toggleIcon);
}

function toggleIcon() {
  let password = document.getElementById("password");
  if (password.type === "password") {
    password.type = "text";
    changeIcon.src = "./images/invisible.png";
  } else {
    password.type = "password";
    changeIcon.src = "./images/show.png";
  }
}

// ****************************************Logout********************************
let logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn && logoutBtn.addEventListener("click", logout);
}

function logout() {
  signOut(auth)
    .then(() => {
      alert("Singout successfully!");
      window.location = "login.html";
    })
    .catch((error) => {
      console.log(error);
    });
}
