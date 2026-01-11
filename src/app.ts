import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import userRouter from "./routes/userAuth.route";
import adminRouter from "./routes/admin.route";
import spellRouter from "./routes/spell.route";
import HouseRouter from "./routes/House.route";
import {
  apiKeyAuthMiddleware,
  rateLimitMiddleware,
} from "./middleware/apiMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/user-auth", userRouter);
app.use(
  "/api/v1/spells",
  apiKeyAuthMiddleware,
  rateLimitMiddleware,
  spellRouter
);
app.use(
  "/api/v1/house",
  apiKeyAuthMiddleware,
  rateLimitMiddleware,
  HouseRouter
);
app.use("/api/v1/admin", adminRouter);

app.use(errorHandler);

export default app;
