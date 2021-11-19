import express from "express";
import { validateRequest } from "../middlewares/validate-request";
import { body } from "express-validator";
import {
  createUserController,
  getUsersController,
} from "../controllers/user.controller";
import { UserTypes } from "../models/types/user-types";

const router = express.Router();

const validateUserBody = () => {
  return [
    body("fullName")
      .isString()
      .withMessage("Full name must be string")
      .trim()
      .notEmpty()
      .withMessage("Full name is required"),
    body("type")
      .isIn(Object.values(UserTypes))
      .withMessage("Invalid user value"),
    body("location").isObject().withMessage("Location object is required"),
    body("location.coordinates")
      .isArray({ min: 2, max: 2 })
      .withMessage(
        "Location coordinates must be an array with two values (long and lat)"
      ),
  ];
};

router.post(
  "/users",
  validateUserBody(),
  validateRequest,
  createUserController
);

// Get all users and filter by cuisine
router.get("/users", getUsersController);

export { router as userRouter };
