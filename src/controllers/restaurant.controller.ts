import { Request, Response } from "express";
import { NotFoundError } from "../common/errors/not-found-error";
import { Restaurant } from "../models/restaurant.model";

export const createRestaurantController = async (
  req: Request,
  res: Response
) => {
  const { name, uniqueName, cuisine, location, owner } = req.body;

  const restaurant = Restaurant.build({
    name,
    uniqueName,
    cuisine,
    location,
    owner,
  });
  await restaurant.save();

  res.status(201).send({ restaurant });
};

export const getAllRestaurantsController = async (
  req: Request,
  res: Response
) => {
  const restaurants = await Restaurant.find();

  res.status(200).send({ restaurants });
};

export const getRestaurantByIdController = async (
  req: Request,
  res: Response
) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    throw new NotFoundError();
  }

  res.status(200).send({ restaurant });
};

export const getNearRestaurantController = async (
  req: Request,
  res: Response
) => {
  // Suppose that we have a user info (location) saved in a session, or from token, whatever the way we fetch the current user.

  const restaurants = await Restaurant.find({
    location: {
      $nearSphere: {
        // we will use user coordinates there instead of the dummy values
        $geometry: { type: "Point", coordinates: [-73.93414657, 40.82302903] },
        $maxDistance: 1000, // measured in meters. 1000 = 1 kilo meter
      },
    },
  });

  res.status(200).send({ restaurants });
};
