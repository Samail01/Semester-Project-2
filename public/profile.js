import { loadComponent } from "./utils/domUtils.js";
import { setupNavbar } from "./utils/navbar.js";
import {
  fetchProfile,
  updateProfileAvatar,
  createListing,
  fetchProfileListings,
} from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  loadComponent("header", "components/navbar.html", setupNavbar);
  loadComponent("footer", "components/footer.html");

  const urlParams = new URLSearchParams(window.location.search);
  const profileName =
    urlParams.get("name") || JSON.parse(localStorage.getItem("user")).name;

  if (profileName) {
    await displayProfileDetails(profileName);
  } else {
    console.error("No profile name found in URL or local storage.");
  }
});

async function displayProfileDetails(name) {
  const profileDetailContainer = document.getElementById("profile-detail");
  if (!profileDetailContainer) {
    console.error('Element with id "profile-detail" not found.');
    return;
  }

  const profile = await fetchProfile(name);
  const listings = await fetchProfileListings(name);
  console.log("Fetched Profile:", profile);
  console.log("Fetched Listings:", listings);

  if (profile) {
    const avatarUrl = profile.avatar ? profile.avatar : "media/placeholder.jpg";
    console.log("Avatar URL:", avatarUrl);

    profileDetailContainer.innerHTML = `
      <div class="flex flex-col items-center bg-gray-200 p-4 rounded-lg">
        <img src="${avatarUrl}" alt="${profile.name}" class="w-24 h-24 rounded-full">
        <h2 class="text-2xl font-bold mt-2">${profile.name}</h2>
        <p class="mt-2"><strong>Credits:</strong> ${profile.credits}</p>
        <form id="avatar-form" class="mt-4 flex">
          <input type="text" id="avatar-url" placeholder="Avatar Url" class="border p-1 rounded-l w-full">
          <button type="submit" class="bg-blue-500 text-white px-2 py-1 rounded-r">Update Avatar</button>
        </form>
        <button id="create-listing-btn" class="mt-4 bg-green-500 text-white px-4 py-2 rounded">Create Listing</button>
      </div>
      <div class="mt-8">
        <h3 class="text-xl font-bold">Your Listings</h3>
        <div id="listings" class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <!-- Listings will be populated here -->
        </div>
      </div>

      <!-- Modal for creating a new listing -->
      <div id="create-listing-modal" class="fixed z-10 inset-0 overflow-y-auto hidden">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Create New Listing</h3>
                  <div class="mt-2">
                    <form id="create-listing-form">
                      <input type="text" id="listing-title" placeholder="Title" class="border p-2 rounded w-full mb-2" required>
                      <input type="text" id="listing-description" placeholder="Description" class="border p-2 rounded w-full mb-2">
                      <input type="url" id="listing-media" placeholder="Media URL" class="border p-2 rounded w-full mb-2" required>
                      <input type="datetime-local" id="listing-endsAt" class="border p-2 rounded w-full mb-2" required>
                      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
                      <button type="button" id="cancel-listing-btn" class="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const avatarForm = document.getElementById("avatar-form");
    avatarForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const avatarUrl = document.getElementById("avatar-url").value;
      console.log("New Avatar URL:", avatarUrl);
      await updateProfileAvatar(name, avatarUrl);
      await displayProfileDetails(name);
    });

    const createListingBtn = document.getElementById("create-listing-btn");
    const createListingModal = document.getElementById("create-listing-modal");
    const createListingForm = document.getElementById("create-listing-form");
    const cancelListingBtn = document.getElementById("cancel-listing-btn");

    createListingBtn.addEventListener("click", () => {
      createListingModal.classList.remove("hidden");
    });

    cancelListingBtn.addEventListener("click", () => {
      createListingModal.classList.add("hidden");
    });

    createListingForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const title = document.getElementById("listing-title").value;
      const description = document.getElementById("listing-description").value;
      const mediaUrl = document.getElementById("listing-media").value;
      const endsAt = new Date(
        document.getElementById("listing-endsAt").value
      ).toISOString();

      const media = [mediaUrl];
      const listingData = { title, description, media, endsAt, tags: [] };

      console.log("Listing Data:", listingData);

      const result = await createListing(listingData);
      if (result) {
        alert("Listing created successfully!");
        createListingModal.classList.add("hidden");
        await displayProfileDetails(name);
      } else {
        alert("Failed to create listing.");
      }
    });

    const listingsContainer = document.getElementById("listings");
    if (listings && listings.length > 0) {
      listings.forEach((listing) => {
        const listingCard = document.createElement("div");
        listingCard.className =
          "border border-[#D7D7D7] rounded-lg overflow-hidden shadow-md bg-white";
        listingCard.addEventListener("click", () => {
          window.location.href = `listing.html?id=${listing.id}`;
        });

        const mediaUrl =
          listing.media && listing.media.length > 0
            ? listing.media[0]
            : "media/placeholder.jpg";

        listingCard.innerHTML = `
          <img src="${mediaUrl}" alt="${listing.title}" class="w-full h-48 object-cover">
          <div class="p-4">
            <h2 class="text-xl font-bold text-center">${listing.title}</h2>
          </div>
        `;

        listingsContainer.appendChild(listingCard);
      });
    } else {
      listingsContainer.innerHTML = "<p>No listings available.</p>";
    }
  } else {
    profileDetailContainer.innerHTML = "<p>Profile not found.</p>";
  }
}
