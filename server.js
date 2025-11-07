// import express from "express";
// import dotenvFlow from "dotenv-flow";
// import cors from "cors";

// import connectDB from "./config/db.js"; // ✅ DB connection helper
// import electricRoutes from "./routes/electric.routes.js";
// import loginRoutes from "./routes/login.routes.js"; // ✅ Login route

// // ✅ Load environment variables
// dotenvFlow.config();

// const app = express();

// // ✅ Middleware
// app.use(cors());
// app.use(express.json());

// // ✅ API Routes
// app.use("/electric", electricRoutes);
// app.use("/auth", loginRoutes);

// // ✅ Root health check
// app.get("/", (req, res) => {
//   res.send("⚡ Electricity Management API is running...");
// });

// // ✅ Connect to DB once when Vercel initializes
// // (Only connect if not already connected)
// let isConnected = false;
// const ensureDBConnection = async () => {
//   if (!isConnected) {
//     console.log("✅ MongoDB connected successfully 111111111111");
//     try {
//       await connectDB();
//       isConnected = true;
//       console.log("✅ MongoDB connected successfully");
//     } catch (err) {
//       console.error("❌ MongoDB connection failed:", err.message);
//     }
//   }
// };

// // ✅ Ensure DB connection before handling requests
// app.use(async (req, res, next) => {
//   await ensureDBConnection();
//   next();
// });

// // ✅ Export the app instead of app.listen()
// export default app;

import express from "express";
import dotenvFlow from "dotenv-flow";
import cors from "cors";
import connectDB from "./config/db.js";
import electricRoutes from "./routes/electric.routes.js";
import loginRoutes from "./routes/login.routes.js";

dotenvFlow.config(); // ✅ Load .env variables

const app = express();

// ✅ Ensure MongoDB connection before handling routes
let isConnected = false;
const ensureDBConnection = async () => {
  if (isConnected) return;
  try {
    await connectDB();
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
};

// ✅ Always connect before handling requests
app.use(async (req, res, next) => {
  await ensureDBConnection();
  next();
});

// ✅ Middleware
app.use(express.json());

// ✅ CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://electric-monitoring-system-frontend.vercel.app", // change this to your frontend URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ Routes
app.use("/electric", electricRoutes);
app.use("/auth", loginRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("⚡ Electricity Management API is running...");
});

// ✅ Local development only
if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 5000;
  ensureDBConnection().then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  });
} else {
  console.log("🌐 Running in serverless (production) mode — no app.listen()");
}

export default app;
