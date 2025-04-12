import express from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Cart from "../models/cart.models.js";
import verifyToken from "../middlewares/user.js";

const router = express.Router();

router.post("/add-cart",verifyToken, async (req, res) => {
  const { image, title, price, rating, category, description } = req.body;
  const newCart = await Cart.create({
    title,
    image,
    quantity: 1,
    rating,
    category,
    price,
    description,
    user: req.user._id
  })
  return res.status(200).json(new ApiResponse("Cart Added successfully", 200, newCart))
});

router.get("/get-cart", verifyToken, async(req, res) => {
  const userId = req.user._id;
  const userCart = await Cart.find({ user: userId });
  if(userCart.length === 0){
    return res.status(200).json(new ApiResponse(`Your cart is empty ${userId} ${userCart}`, 200))
  }
  return res.status(200).json(new ApiResponse("Your cart items", 200, userCart))
});

router.post("/remove-cart", verifyToken, async(req, res)=>{
  const { title } = req.body;
  if(!title){
    return res.status(401).json(new ApiError("Title is required", 401))
  }
  const newCart = await Cart.findOneAndDelete({ title, user: req.user._id })
  return res.json(new ApiResponse("Cart deleted successfully", 200, newCart))
})

router.get("/cart-count", verifyToken, async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(400).json(new ApiError("Not authorized", 400));
  }
  try {
    const count = await Cart.find({ user: userId });
    return res.status(200).json(new ApiResponse("Cart count", 200, { count: count.length }));
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return res.status(500).json(new ApiError("Error fetching cart count", 500));
  }
});

export default router;
