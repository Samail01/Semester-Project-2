/* All Fetches for the website */

/* Fetches for User management, Login, Register, and Logout */
export const userAuthEndpoints = {
  register: "https://api.noroff.dev/api/v1/auction/auth/register",
  login: "https://api.noroff.dev/api/v1/auction/auth/login",
};

/* Fetch limited listings for Home Page */
export const fetchListings = async (limit = 12) => {
  const url = `https://api.noroff.dev/api/v1/auction/listings?_seller=true&_bids=true&_count=true&sort=endsAt&sortOrder=desc&_active=true&limit=${limit}`;

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

/* Fetch all listings for Listings Page */
export const fetchAllListings = async () => {
  const url = `https://api.noroff.dev/api/v1/auction/listings?_seller=true&_bids=true&_count=true&sort=endsAt&sortOrder=desc&_active=true`;

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

/* Fetch listings by tag */
export const fetchListingsByTag = async (tag) => {
  const url = `https://api.noroff.dev/api/v1/auction/listings?_tag=${tag}&_active=true`;

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
    console.error("Error fetching listings by tag:", error);
    return [];
  }
};

/* Fetch single listing */
export const fetchSingleListing = async (id) => {
  const url = `https://api.noroff.dev/api/v1/auction/listings/${id}?_seller=true&_bids=true`;

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
    console.error("Error fetching single listing:", error);
    return null;
  }
};

/* Fetch profile details */
export const fetchProfile = async (name) => {
  const token = localStorage.getItem("user-token");
  const url = `https://api.noroff.dev/api/v1/auction/profiles/${name}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch profile");
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

/* Fetch profile listings */
export const fetchProfileListings = async (name) => {
  const token = localStorage.getItem("user-token");
  const url = `https://api.noroff.dev/api/v1/auction/profiles/${name}/listings`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch profile listings");
    }
  } catch (error) {
    console.error("Error fetching profile listings:", error);
    return [];
  }
};

/* Update profile avatar */
export const updateProfileAvatar = async (name, avatarUrl) => {
  const url = `https://api.noroff.dev/api/v1/auction/profiles/${name}/media`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
      },
      body: JSON.stringify({ avatar: avatarUrl }),
    });
    if (!response.ok) {
      throw new Error("Failed to update profile avatar");
    }
    return response.ok;
  } catch (error) {
    console.error("Error updating profile avatar:", error);
    return false;
  }
};

/* Place a bid on a listing */
export const placeBid = async (listingId, bidAmount) => {
  const url = `https://api.noroff.dev/api/v1/auction/listings/${listingId}/bids`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
      },
      body: JSON.stringify({ amount: parseFloat(bidAmount) }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      throw new Error(`Failed to place bid: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error placing bid:", error);
    return null;
  }
};

/* Function to create a new listing */
export const createListing = async (listingData) => {
  const url = "https://api.noroff.dev/api/v1/auction/listings";
  const token = localStorage.getItem("user-token");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(listingData),
  };

  try {
    const response = await fetch(url, requestOptions);
    const responseData = await response.json();
    if (!response.ok) {
      console.error("Error data:", responseData);
      throw new Error("Failed to create listing");
    }
    return responseData;
  } catch (error) {
    console.error("Error creating listing:", error);
    return null;
  }
};
