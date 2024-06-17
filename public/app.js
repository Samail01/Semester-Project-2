// public/app.js
import { fetchListings } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "components/navbar.html");
  loadComponent("footer", "components/footer.html");
  displayListings();
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

async function displayListings() {
  const listingsContainer = document.getElementById("listings");
  listingsContainer.innerHTML = ""; // Clear any existing content

  const listings = await fetchListings();
  console.log(listings); // Log to inspect the structure

  listings.forEach((listing) => {
    const listingCard = document.createElement("div");
    listingCard.className =
      "border border-[#D7D7D7] rounded-lg overflow-hidden shadow-md bg-white";

    let mediaUrl = "media/placeholder.jpg";
    if (listing.media && listing.media.length > 0) {
      mediaUrl = listing.media[0];
    }

    const endsAt = new Date(listing.endsAt).toLocaleDateString();
    const timeLeft = getTimeLeft(listing.endsAt);

    listingCard.innerHTML = `
      <img src="${mediaUrl}" alt="${listing.title}" class="w-full h-48 object-cover">
      <div class="p-4">
        <h2 class="text-xl font-bold text-center">${listing.title}</h2>
        <hr class="my-2 border-[#D7D7D7]">
        <div class="flex justify-between text-red-500">
          <p>Time left:</p>
          <p>Price at:</p>
        </div>
        <div class="flex justify-between text-black">
          <p>${timeLeft}</p>
          <p>$${listing._count.bids}</p>
        </div>
      </div>
    `;

    listingsContainer.appendChild(listingCard);
  });

  // Add "View All" button
  const viewAllButton = document.createElement("button");
  viewAllButton.className = "mt-4 bg-[#4169E1] text-white px-4 py-2 rounded";
  viewAllButton.innerText = "View All";
  viewAllButton.addEventListener("click", () => {
    window.location.href = "listings.html";
  });

  listingsContainer.appendChild(viewAllButton);
}

function getTimeLeft(endTime) {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
}
