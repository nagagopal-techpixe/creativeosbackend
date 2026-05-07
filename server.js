import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import videoBuilderRoutes from "./routes/videoBuilderRoutes.js";
import voiceBuilderRoutes from "./routes/voicerouter.js";
import musicBuilderRoutes from "./routes/musicBuilder.js";
import characterBuilderRoutes from "./routes/characterBuilder.js";
import imageBuilderRoutes from "./routes/imageBuilder.js";
import storyboardBuilderRoutes from "./routes/storyboardBuilder.js";
import navConfigRoute from "./routes/navConfig.js";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./routes/userRoutes.js";
import YAML from "yamljs";
import Category from "./routes/categoryRoutes.js";
import Models from "./routes/modelRoutes.js";
import runRoutes from "./routes/runRoutes.js";
import loaderRoutes from "./routes/LoaderRoutes.js";
import projectsRoutes from "./routes/Projectrouter.js";
import generationRoutes from "./routes/Generationroutes.js"
import activeModelRoutes from "./routes/activeModelRoutes.js";
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());




app.use("/api/auth",  authRoutes);
app.use("/api/auth/admin", adminRoutes);
app.use("/api/admin/video", videoBuilderRoutes);
app.use("/api/admin/voice", voiceBuilderRoutes);
app.use("/api/admin/character", characterBuilderRoutes);
app.use("/api/admin/music", musicBuilderRoutes);
app.use("/api/admin/image", imageBuilderRoutes);
app.use("/api/admin/storyboard", storyboardBuilderRoutes);
app.use("/api/admin/nav", navConfigRoute);
app.use("/api/user", userRoutes);
app.use("/api/admin/categories", Category);
app.use("/api/admin/models", Models)  ;
app.use("/api/admin/run", runRoutes);
app.use("/api/admin/loader", loaderRoutes);
app.use("/api/admin/projects", projectsRoutes);
app.use("/api/user/generations", generationRoutes);
app.use("/api/admin/activemodel", activeModelRoutes);


const swaggerDocument = YAML.load("./docs/swagger.yaml");

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
 Server running on: http://localhost:${PORT}
 Swagger docs available at: http://localhost:${PORT}/api/docs
`);
});