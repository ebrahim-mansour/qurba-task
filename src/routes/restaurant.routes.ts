import mongoose from "mongoose";
import express from "express";
import { body, param } from "express-validator";
import {
  createRestaurantController,
  getAllRestaurantsController,
  getNearRestaurantController,
  getRestaurantByIdController,
} from "../controllers/restaurant.controller";
import { validateRequest } from "../middlewares/validate-request";
import { RestaurantCuisines } from "../models/types/restaurant-cuisines";
import { Restaurant } from "../models/restaurant.model";
import { BadRequestError } from "../common/errors/bad-request-error";
import { User } from "../models/user.model";
import { UserTypes } from "../models/types/user-types";

const router = express.Router();

const validateRestaurantBody = () => {
  return [
    body("name")
      .isString()
      .withMessage("Name must be string")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),
    body("uniqueName")
      .isString()
      .withMessage("uniqueName must be string")
      .trim()
      .notEmpty()
      .withMessage("uniqueName is required")
      .custom(async (uniqueName: string) => {
        const isRestaurantUniqueNameExists = await Restaurant.findOne({
          uniqueName,
        });

        if (isRestaurantUniqueNameExists) {
          throw new BadRequestError(
            "Restaurant unique name already used before"
          );
        }

        return true;
      }),
    body("cuisine")
      .isIn(Object.values(RestaurantCuisines))
      .withMessage("Invalid cuisine value"),
    body("location").isObject().withMessage("Location object is required"),
    body("location.coordinates")
      .isArray({ min: 2, max: 2 })
      .withMessage(
        "Location coordinates must be an array with two values (long and lat)"
      ),
    body("owner").custom(async (owner: string) => {
      if (mongoose.Types.ObjectId.isValid(owner)) {
        const user = await User.findById(owner);

        if (!user || user.type === UserTypes.Normal) {
          throw new BadRequestError("Invalid user id");
        }
      }

      return true;
    }),
  ];
};

const validateRestaurantId = () => {
  return [param("id").isMongoId().withMessage("Invalid id")];
};

router.get("/restaurants", getAllRestaurantsController);
router.post(
  "/restaurants",
  validateRestaurantBody(),
  validateRequest,
  createRestaurantController
);
router.get("/restaurants/near", getNearRestaurantController);
router.get(
  "/restaurants/:id",
  validateRestaurantId(),
  validateRequest,
  getRestaurantByIdController
);

export { router as restaurantRouter };
