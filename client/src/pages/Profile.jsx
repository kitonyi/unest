import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserInfoFailure,
  updateUserInfoStart,
  updateUserInfoSuccess,
} from "../redux/slices/userSlice.js";
import { useDispatch } from "react-redux";

const Profile = () => {
  const { currentUser, loading, error } = useSelector(
    (state) => state.user.user
  );
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(undefined);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  // const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  //console.log(file)
  //console.log(fileUploadProgress);
  //console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleChange = (e) => {
    setFormData({ ...FormData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserInfoStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        // credentials: "include", // Include credentials (cookies) in the request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserInfoFailure(data.message));
        return;
      }
      dispatch(updateUserInfoSuccess(data));
      // setUpdateSuccess(true);
      toast.success("User details updated successfully");
    } catch (error) {
      dispatch(updateUserInfoFailure(error.message));
    }
  };
  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // See the progress of the upload
        //console.log("Upload is " + progress + "% done ");
        setFileUploadProgress(Math.round(progress));
      },
      (error) => {
        //console.log(error);
        setFileUploadError(true);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...FormData, avatar: downloadURL });
        });
      }
    );
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart);
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("User deleted successfully");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile picture"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : fileUploadProgress > 0 && fileUploadProgress < 100 ? (
            <span className="text-slate-700">{`Uploading ${fileUploadProgress}%`}</span>
          ) : fileUploadProgress === 100 && !fileUploadError ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
          defaultValue={currentUser.username}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-75"
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      {/* <p className="text-green-700 mt-5">
        {updateSuccess ? "User details updated successfully" : ""}
      </p> */}

      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
};

export default Profile;
