import { fetchListings, fetchAllListings } from "../api.js";

/* Displays listings on Home page */
export async function displayListings() {
  const listingsContainer = document.getElementById("listings");
  listingsContainer.innerHTML = "";

  const listings = await fetchListings();
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

  // Add "View All" button
  if (listings.length >= 12) {
    const viewAllButtonContainer = document.createElement("div");
    viewAllButtonContainer.className = "flex justify-center mt-4";
    const viewAllButton = document.createElement("button");
    viewAllButton.className = "bg-[#4169E1] text-white px-4 py-2 rounded";
    viewAllButton.innerText = "View All";
    viewAllButton.addEventListener("click", () => {
      window.location.href = "listings.html";
    });

    viewAllButtonContainer.appendChild(viewAllButton);
    listingsContainer.parentNode.appendChild(viewAllButtonContainer);
  }
}

/* Displays all listings on Listings page */
export async function displayAllListings() {
  const listingsContainer = document.getElementById("listings-all");
  listingsContainer.innerHTML = "";

  const listings = await fetchAllListings();
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
