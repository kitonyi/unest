import Listing from "../models/listing.model.js";

export const createListing = async (req, resizeBy, next) => {
  try {
    const listing = await Listing.create(req.body);
    return resizeBy.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
