import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan';
import connectDB from './db.js';
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoute from "./routes/cartRoute.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import cors from "cors"
// const allowedOrigin = new Set((process.env.CORS_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean));


//config
dotenv.config()
connectDB();

//rest object
const app = express();

//midleware
app.use(cors());
// app.use(cors({ origin(origin, callback) {
//       if (!origin || origin === allowedOrigin) {
//         return callback(null, true);
//     }
//       return callback(new AppError(403, 'Origin is not allowed by CORS'));
//     },
//   })
// );
// app.use(express.json())
app.use(express.json({ limit: '1mb', strict: true }));
app.use(morgan('dev'))
app.use(express.static('build'))
const allowedOrigins = new Set((process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean));

//******* */ =>  ROUTES
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/category', categoryRoute )
app.use('/api/v1/product', productRoutes )
app.use('/api/v1/order', orderRoutes )
app.use('/api/v1/wishlist', wishlistRoutes )
app.use('/api/v1/cart', cartRoute )
app.use("/api/v1/review", reviewRoutes);

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 8080;

//Listen
app.listen(PORT, ()=> {
    console.log(`Server Runing on on port ${PORT}`)
})