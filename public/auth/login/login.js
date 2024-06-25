import { userAuthEndpoints } from "../../api.js";

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "/public/components/navbar.html");
  loadComponent("footer", "/public/components/footer.html");

  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(userAuthEndpoints.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        localStorage.setItem("user-token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("user-name", data.name);
        console.log("Token stored:", localStorage.getItem("user-token"));
        alert("Login successful!");
        updateNavbar();
        window.location.href = "/public/index.html";
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during login.");
    }
  });
});

function loadComponent(id, url) {
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      const element = document.getElementById(id);
      if (element) {
        element.innerHTML = data;
        if (id === "header") {
          setupNavbar();
          updateNavbar();
        }
      } else {
        console.error(`Element with id "${id}" not found.`);
      }
    })
    .catch((error) => console.error("Error loading component:", error));
}

function setupNavbar() {
  const menuButton = document.getElementById("menu-button");
  const closeMenuButton = document.getElementById("close-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuButton && mobileMenu && closeMenuButton) {
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    closeMenuButton.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  } else {
    console.error("Navbar elements not found.");
  }

  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", () => {
      localStorage.clear();
      alert("Logged out successfully!");
      updateNavbar();
      window.location.href = "/public/index.html";
    });
  }
}

function updateNavbar() {
  console.log("Updating Navbar");
  const token = localStorage.getItem("user-token");
  console.log("Token:", token);
  const registerLink = document.getElementById("register-link");
  const loginLink = document.getElementById("login-link");
  const profileLink = document.getElementById("profile-link");
  const logoutLink = document.getElementById("logout-link");

  const mobileRegisterLink = document.getElementById("mobile-register-link");
  const mobileLoginLink = document.getElementById("mobile-login-link");
  const mobileProfileLink = document.getElementById("mobile-profile-link");
  const mobileLogoutLink = document.getElementById("mobile-logout-link");

  if (token) {
    if (registerLink) registerLink.style.display = "none";
    if (loginLink) loginLink.style.display = "none";
    if (profileLink) profileLink.style.display = "block";
    if (logoutLink) logoutLink.style.display = "block";

    if (mobileRegisterLink) mobileRegisterLink.style.display = "none";
    if (mobileLoginLink) mobileLoginLink.style.display = "none";
    if (mobileProfileLink) mobileProfileLink.style.display = "block";
    if (mobileLogoutLink) mobileLogoutLink.style.display = "block";
  } else {
    if (registerLink) registerLink.style.display = "block";
    if (loginLink) loginLink.style.display = "block";
    if (profileLink) profileLink.style.display = "none";
    if (logoutLink) logoutLink.style.display = "none";

    if (mobileRegisterLink) mobileRegisterLink.style.display = "block";
    if (mobileLoginLink) mobileLoginLink.style.display = "block";
    if (mobileProfileLink) mobileProfileLink.style.display = "none";
    if (mobileLogoutLink) mobileLogoutLink.style.display = "none";
  }
}
