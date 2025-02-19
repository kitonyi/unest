import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

// OAuth component for handling Google sign-in
const OAuth = () => {
  const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider(); // Create a new Google Auth provider instance
      const auth = getAuth(app); // Get the Firebase Auth instance

      // Sign in with Google using a popup
      const result = await signInWithPopup(auth, provider);
      //console.log(result);

      // Send the user's Google profile information to the backend
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

      // Dispatch the signInSuccess action with the response data
      dispatch(signInSuccess(data));
      // Navigate to the home page on successful sign-in
      navigate("/");
    } catch (error) {
      // Log an error message if the sign-in fails
      console.log("Could not sign in with Google", error);
    }
  };

  // Render the Google sign-in button
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
