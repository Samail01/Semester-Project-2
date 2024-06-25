import { fetchListingsByTag } from "./api.js";
import { loadComponent } from "./utils/domUtils.js";
import { setupNavbar, updateNavbar } from "./utils/navbar.js";
import { displayListings, displayAllListings } from "./utils/domListings.js";

/* Waits until DOM is loaded */
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "components/navbar.html", setupNavbar);
  loadComponent("footer", "components/footer.html");
  if (document.body.contains(document.getElementById("listings-all"))) {
    displayAllListings();
  } else {
    displayListings();
  }
  setupSearch();
  updateNavbar();
});

/* Setup search functionality */
function setupSearch() {
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");

  if (searchButton && searchInput) {
    searchButton.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query) {
        searchListings(query);
      }
    });
  }
}

/* Search listings by tag */
async function searchListings(query) {
  const listingsContainer = document.getElementById("listings");
  if (!listingsContainer) {
    console.error('Element with id "listings" not found.');
    return;
  }

  listingsContainer.innerHTML = "";

  const listings = await fetchListingsByTag(query);
  console.log(listings);

  listings.forEach(async (listing) => {
    const listingCard = document.createElement("div");
    listingCard.className =
      "border border-[#D7D7D7] rounded-lg overflow-hidden shadow-md bg-white";
    listingCard.addEventListener("click", () => {
      window.location.href = `listing.html?id=${listing.id}`;
    });

    let mediaUrl = await validateImageUrl(
      listing.media && listing.media.length > 0
        ? listing.media[0]
        : "media/placeholder.jpg"
    );

    const endsAt = new Date(listing.endsAt).toLocaleDateString();
    const timeLeft = getTimeLeft(listing.endsAt);

    listingCard.innerHTML = `
          <img src="${mediaUrl}" alt="${listing.title}" class="w-full h-48 object-cover">
          <div class="p-4">
            <h2 class="text-xl font-bold text-center">${listing.title}</h2>
            <hr class="my-2 border-[#D7D7D7]">
            <div class="flex justify-between text-red-500">
              <p>Time left:</p>
              <p>Started at:</p>
            </div>
            <div class="flex justify-between text-black">
              <p>${timeLeft}</p>
              <p>$${listing._count.bids}</p>
            </div>
          </div>
        `;

    listingsContainer.appendChild(listingCard);
  });
}

/* Validate if the image URL is valid */
async function validateImageUrl(url) {
  try {
    const response = await fetch(url, { method: "HEAD", mode: "no-cors" });
    if (response.ok || response.type === "opaque") {
      return url;
    } else {
      return "media/placeholder.jpg";
    }
  } catch (error) {
    return "media/placeholder.jpg";
  }
}

/* Function that calculates the remaining time of a listing */
function getTimeLeft(endTime) {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
}
