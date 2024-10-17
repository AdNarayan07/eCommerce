import { logout } from "../app/slice/authSlice"; // Import logout action from Redux slice

// Function to determine color based on order status
export function color(status) {
  if (!status) return "gray"; // Default color if no status
  if (status.startsWith("Cancelled")) return "red"; // Color for cancelled status
  if (status.includes("Deliver")) return "green"; // Color for delivered status
  if (status === "Shipped") return "yellow"; // Color for shipped status
  if (status === "Placed") return "blue"; // Color for placed status
  return "gray"; // Fallback color
}

// Function to handle errors from API requests
export function handleError(err, navigateTransition, dispatch, toAlert = true) {
  if (err.status === 498) {
    alert("Token Expired or Invalid, Login Again!"); // Alert for expired token
    dispatch(logout()); // Dispatch logout action to update state
    navigateTransition("/login"); // Redirect to login page
  } else {
    if (toAlert) alert(err.response?.data?.message || err.message || err); // Show error message if applicable
  }
  console.error(err); // Log the error to console for debugging
}

export function generateConfig(token, data) {
  return {
    headers: {
      Authorization: `Bearer ${token}`, // Set the Authorization header with the Bearer token
    },
    data, // Attach the data to the config object
  };
}