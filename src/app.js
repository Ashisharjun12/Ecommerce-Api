import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/ErrorHandler.js";
import userRoute from "./routes/UserRoute.js";
import cookieParser from "cookie-parser";
import productRoute from "./routes/ProductRoute.js";
import orderRoute from "./routes/OrderRoute.js";
import paymentRoute from "./routes/PaymentRoute.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from 'url';

// Load Swagger document
const swaggerDocument = YAML.load(path.resolve("./swagger.yaml"));

// Create app
const app = express();

// Important middlewares
app.use(cors({ origin: "*" }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//dark mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/swaggerDark.css', express.static(path.join(__dirname, 'swaggerDark.css')));

// Customize Swagger UI options to include the dark mode CSS
const swaggerOptions = {
  customCssUrl: '/swaggerDark.css',
};

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Check server
app.get("/", (req, res) => {
  res.json({ message: "server is running...👋🏻" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ message: "Server is healthy..😃" });
});

// Routes
app.use("/api/v1", userRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);

// Error handler
app.use(errorHandler);

export default app;
