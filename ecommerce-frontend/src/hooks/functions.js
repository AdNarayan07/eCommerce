import { logout } from "../app/slice/authSlice";

export function color(status) {
  if (!status) return "gray";
  if (status.startsWith("Cancelled")) return "red";
  if (status.includes("Deliver")) return "green";
  if (status === "Shipped") return "yellow";
  if (status === "Placed") return "blue";
  return "gray";
}

export function handleError(err, navigateTransition, dispatch, toAlert = true) {
  if (err.status === 498) {
    alert("Token Expired or Invalid, Login Again!");
    dispatch(logout());
    navigateTransition("/login");
  } else {
    if (toAlert) alert(err.response?.data?.message || err.message || err);
  }
  console.error(err);
}
