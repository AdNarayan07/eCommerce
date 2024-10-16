import { useTransition, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPending } from "../app/slice/transitionSlice";

const useNavigateTransition = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    dispatch(setPending(isPending));
    console.log(isPending)
  }, [isPending, dispatch]);

  const navigateTransition = (path) => {
    startTransition(() => {
      navigate(path);
    });
  };

  return navigateTransition;
};

export default useNavigateTransition;