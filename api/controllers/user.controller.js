import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({
    message: "Hello world",
  });
};

export const updateUserInfo = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You can only update your own profile"));
  }
  // console.log(req.body);
  try {
    if (req.body.password) {
      req.body.password = await bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        // set the new values of the user ignoring the ones that are not provided
        $set: {
          avatar: req.body.avatar,
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        },
      },
      { new: true } // return the updated user
    );

    const { password, ...userDetails } = updatedUser._doc;
    res.status(200).json(userDetails);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You can only delete your own account"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
