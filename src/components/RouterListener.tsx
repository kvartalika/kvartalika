import {useNavigate} from "react-router-dom";
import {useAuthStore} from "../store/auth.store.ts";
import {useEffect} from "react";

const RouterListener = () => {
  const navigate = useNavigate();
  const shouldRedirectTo = useAuthStore(state => state.shouldRedirectTo);
  const clearRedirect = useAuthStore(state => state.clearRedirect);

  useEffect(() => {
    if (shouldRedirectTo) {
      navigate(shouldRedirectTo);
      clearRedirect();
    }
  }, [shouldRedirectTo, navigate, clearRedirect]);

  return null;
};

export default RouterListener;