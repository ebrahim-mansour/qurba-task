import { Request, Response } from "express";
import { User } from "../models/user.model";

export const createUserController = async (req: Request, res: Response) => {
  const { fullName, type, location } = req.body;

  const user = User.build({
    fullName,
    type,
    location,
  });
  await user.save();

  res.status(201).send({ user });
};

export const getUsersController = async (req: Request, res: Response) => {
  const cuisine = req.query.cuisine;
  let users;

  // Get all normal users who favorited the cuisine
  // Or all owner users who have a restaurant with the cuisine 
  if (cuisine) {
    users = await User.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "owner",
          as: "restaurnts",
        },
      },
      {
        $match: {
          $or: [
            { $expr: { $in: [cuisine, "$favoriteCuisines"] } },
            { "restaurnts.cuisine": cuisine },
          ],
        },
      },
    ]);
  } else {
    users = await User.find();
  }

  res.status(200).send({ users });
};
