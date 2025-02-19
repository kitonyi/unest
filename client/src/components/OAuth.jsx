import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/slices/userSlice";
import {useNavigate} from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      //console.log(result);

      const res = await fetch("api/auth/google", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      //console.log(data);
      dispatch(signInSuccess(data));
      navigate("/")

    } catch (error) {
      console.log("Could not sign in with Google", error);
    }
  };
  return (
    <button
      onClick={handleGoogleSignIn}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg hover:opacity-85"
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
