import mongoose, { Schema, Model } from "mongoose";

export interface IDish {
  name: string;
  description?: string;
  price: number;
  category: "appetizer" | "main" | "dessert" | "beverage" | "special";
  image: string;
  isAvailable: boolean;
  preparationTime: number;
  isTodaysSpecial: boolean;
  ingredients: string[];
  spicyLevel: number;
  restaurantId: mongoose.Types.ObjectId;
}

const dishSchema = new Schema<IDish>(
  {
    name: {
      type: String,
      required: [true, "Dish name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Dish price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      enum: ["appetizer", "main", "dessert", "beverage", "special"],
      default: "main",
    },
    image: {
      type: String,
      default: "/images/default-dish.jpg",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: Number,
      default: 15,
      min: [5, "Minimum preparation time is 5 minutes"],
    },
    isTodaysSpecial: {
      type: Boolean,
      default: false,
    },
    ingredients: [String],
    spicyLevel: {
      type: Number,
      min: 0,
      max: 3,
      default: 0,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
  },
  { timestamps: true }
);

const Dish: Model<IDish> =
  mongoose.models.Dish || mongoose.model<IDish>("Dish", dishSchema);

export default Dish;
