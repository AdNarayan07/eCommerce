import { useEffect } from "react"; // Import useEffect hook for side effects
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation
import { useSelector } from "react-redux"; // Import useSelector to access Redux store

// Custom hook to redirect users based on authentication state
const useAuthRedirect = (shouldRedirectOnUser, redirectPath = "/") => {
  const navigate = useNavigate(); // Get the navigate function from react-router
  const user = useSelector((state) => state.auth.user); // Access the authenticated user from Redux store

  useEffect(() => {
    // Check the user's authentication state and redirect if necessary
    if ((shouldRedirectOnUser && user) || (!shouldRedirectOnUser && !user)) {
      navigate(redirectPath); // Redirect to the specified path
    }  
  }, [user, navigate]); // Re-run effect when user state or navigate function changes
};

export default useAuthRedirect; // Export the custom hook for use in other components
