// public/app.js
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "components/navbar.html");
  loadComponent("footer", "components/footer.html");
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
}
