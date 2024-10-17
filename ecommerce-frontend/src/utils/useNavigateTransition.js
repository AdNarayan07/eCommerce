import { useTransition, useEffect } from "react"; // Import hooks for transition management
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation
import { useDispatch } from "react-redux"; // Import useDispatch to access Redux actions
import { setPending } from "../app/slice/transitionSlice"; // Import action to set pending state

// Custom hook to handle navigation with transition management
const useNavigateTransition = () => {
  const navigate = useNavigate(); // Get the navigate function from react-router
  const dispatch = useDispatch(); // Get the dispatch function for Redux actions
  const [isPending, startTransition] = useTransition(); // Manage transition state

  useEffect(() => {
    // Dispatch the pending state to the Redux store whenever isPending changes
    dispatch(setPending(isPending));
    console.log(isPending); // Log the pending state for debugging
  }, [isPending, dispatch]); // Run effect whenever isPending or dispatch changes

  const navigateTransition = (path) => {
    // Function to navigate with transition
    startTransition(() => {
      navigate(path); // Navigate to the specified path
    });
  };

  return navigateTransition; // Return the navigateTransition function for use in components
};

export default useNavigateTransition; // Export the custom hook for use in other components
