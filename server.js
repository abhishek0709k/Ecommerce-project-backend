import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./db/connectdb.js";
import authRouter from "./controllers/auth.controllers.js"
import cartRouter from "./controllers/cart.controllers.js"
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: ["https://67fa6f106f60533f07dd0891--ecommerce-frontend-project.netlify.app", "http://localhost:5173"],
    credentials: true
};

connectDB();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/cart", cartRouter);


app.listen(port, ()=>{
    console.log(`Server is running of PORT:${port}`);
})
