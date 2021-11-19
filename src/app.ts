import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { restaurantRouter } from "./routes/restaurant.routes";
import { userRouter } from "./routes/user.routes";
import cors from "cors";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./common/errors/not-found-error";

const app = express();
app.use(cors());
app.use(json());

app.use("/api", restaurantRouter);
app.use("/api", userRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
