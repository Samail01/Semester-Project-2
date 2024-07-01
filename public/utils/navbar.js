/* Setup navbar for desktop and mobile */
export function setupNavbar() {
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

  /* Logout | removes the localStorage info and redirects to Home page */
  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", () => {
      localStorage.clear();
      alert("Logged out successfully!");
      updateNavbar();
      window.location.href = "/index.html";
    });
  }

  updateNavbar();
}

/* Update navbar based on user login status, if logged in logout and profile appears */
export function updateNavbar() {
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
