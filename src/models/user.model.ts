import mongoose from "mongoose";
import { RestaurantCuisines } from "./types/restaurant-cuisines";
import { UserTypes } from "./types/user-types";

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  fullName: string;
  favoriteCuisines?: RestaurantCuisines[];
  type: UserTypes;
  location: object;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
export interface UserDoc extends mongoose.Document {
  fullName: string;
  favoriteCuisines: RestaurantCuisines[];
  type: UserTypes;
  location: object;
}

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    favoriteCuisines: {
      type: [String],
      enum: Object.values(RestaurantCuisines),
      default: [],
    },
    type: {
      type: String,
      enum: Object.values(UserTypes),
      required: true,
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: Array,
        required: true,
      },
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
