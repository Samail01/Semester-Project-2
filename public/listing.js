import { loadComponent } from "./utils/domUtils.js";
import { setupNavbar } from "./utils/navbar.js";
import { fetchSingleListing, placeBid } from "./api.js";

// Wait until DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  loadComponent("header", "components/navbar.html", setupNavbar);
  loadComponent("footer", "components/footer.html");

  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get("id");

  if (listingId) {
    displayListingDetails(listingId);
  } else {
    console.error("No listing ID found in URL.");
  }
});

// Function to display listing details
async function displayListingDetails(id) {
  const listingDetailContainer = document.getElementById("listing-detail");
  if (!listingDetailContainer) {
    console.error('Element with id "listing-detail" not found.');
    return;
  }

  const listing = await fetchSingleListing(id);
  console.log(listing);

  if (listing) {
    let mediaUrl =
      listing.media && listing.media.length > 0
        ? listing.media[0]
        : "media/placeholder.jpg";

    const endsAt = new Date(listing.endsAt).toLocaleString();
    const timeLeft = getTimeLeft(listing.endsAt);
    const priceAt = listing._count.bids;
    const bids = listing.bids
      .map(
        (bid) =>
          `<div class="flex justify-between border-b p-2">
            <span>${bid.bidderName}</span>
            <span>${new Date(bid.created).toLocaleDateString()}</span>
            <span>$${bid.amount}</span>
          </div>`
      )
      .join("");

    listingDetailContainer.innerHTML = `
      <div class="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
        <img src="${mediaUrl}" alt="${listing.title}" class="w-full md:w-2/3 object-cover h-64 md:h-auto">
        <div class="p-4 md:w-1/3">
          <h2 class="text-2xl font-bold text-center mb-2">${listing.title}</h2>
          <hr class="my-2 border-gray-400">
          <p class="text-center">${listing.description}</p>
          <div class="flex flex-col md:flex-row mt-4 justify-between items-center">
            <div class="text-center md:text-left md:w-1/2">
              <p class="text-red-500"><strong>Time left:</strong> ${timeLeft}</p>
              <p class="text-red-500"><strong>Started at:</strong> $${priceAt}</p>
            </div>
            <div class="text-center md:text-right md:w-1/2 pt-4">
              <p class="text-xl font-bold mb-4">Place bid</p>
              <input type="number" id="bid-amount" placeholder="Bid amount" class="border p-2 rounded w-full mb-2">
              <button id="bid-button" class="bg-blue-500 text-white px-4 py-2 rounded">Bid Now</button>
              <p id="bid-error" class="text-red-500 mt-2 hidden"></p>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 bg-gray-100 rounded-b-lg">
        <h3 class="text-xl font-bold mb-2">All Bids</h3>
        ${bids}
      </div>
    `;

    document
      .getElementById("bid-button")
      .addEventListener("click", async () => {
        const bidAmount = document.getElementById("bid-amount").value;
        const bidError = document.getElementById("bid-error");

        if (bidAmount) {
          const result = await placeBid(id, bidAmount);
          if (result) {
            alert("Bid placed successfully!");
            displayListingDetails(id);
          } else {
            bidError.textContent = "Failed to place bid. Please try again.";
            bidError.classList.remove("hidden");
          }
        } else {
          bidError.textContent = "Please enter a bid amount.";
          bidError.classList.remove("hidden");
        }
      });
  } else {
    listingDetailContainer.innerHTML = "<p>Listing not found.</p>";
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
