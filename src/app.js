import express from "express";
import helmet from "helmet";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";

import categoriesRoutes from "./routes/categorr.routes.js";
import requirementsRoutes from "./routes/requirements.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import eventRoutes from "./routes/event.routes.js";
import actorRoutes from "./routes/actor.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import clientRoutes from "./routes/client.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/categories", categoriesRoutes);
app.use("/requirement", requirementsRoutes);
app.use("/contact", contactRoutes);
app.use("/event", eventRoutes);
app.use("/actor", actorRoutes);
app.use("/review", reviewRoutes);
app.use("/client", clientRoutes);

app.use(errorHandler);

export default app;
