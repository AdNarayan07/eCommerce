import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const useAuthRedirect = (shouldRedirectOnUser, redirectPath = "/") => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if ((shouldRedirectOnUser && user) || (!shouldRedirectOnUser && !user)) {
        navigate(redirectPath);
      }  
  }, [user, navigate]);
};

export default useAuthRedirect;