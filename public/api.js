/* All Fetches for the website */

/* Fetches for User managment, Login, Register and Logout. */

/* Fetch All listings for Home Page */
export const fetchListings = async (limit = 12) => {
  const url = `https://api.noroff.dev/api/v1/auction/listings?_seller=true&_bids=true&_count&sort=endsAt&sortOrder=desc&_active=true&tags=true&limit=${limit}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
};
