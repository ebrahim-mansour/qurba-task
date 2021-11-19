import mongoose from "mongoose";
import { RestaurantCuisines } from "./types/restaurant-cuisines";
import { UserDoc } from "./user.model";

// An interface that describes the properties
// that are requried to create a new Restaurant
interface RestaurantAttrs {
  name: string;
  uniqueName: string;
  cuisine: RestaurantCuisines;
  location: object;
  owner: UserDoc;
}

// An interface that describes the properties
// that a Restaurant Model has
interface RestaurantModel extends mongoose.Model<RestaurantDoc> {
  build(attrs: RestaurantAttrs): RestaurantDoc;
}

// An interface that describes the properties
// that a Restaurant Document has
interface RestaurantDoc extends mongoose.Document {
  name: string;
  uniqueName: string;
  cuisine: RestaurantCuisines;
  location: object;
  owner: UserDoc;
}

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    uniqueName: {
      type: String,
      unique: true,
      required: true,
    },
    cuisine: {
      type: String,
      enum: Object.values(RestaurantCuisines),
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

restaurantSchema.index({ location: "2dsphere" });

restaurantSchema.statics.build = (attrs: RestaurantAttrs) => {
  return new Restaurant(attrs);
};

const Restaurant = mongoose.model<RestaurantDoc, RestaurantModel>(
  "Restaurant",
  restaurantSchema
);

export { Restaurant };
