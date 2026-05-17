import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    googleId: { type: String },
    picture: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    phone: { type: String },
    address: {
      street:  { type: String },
      city:    { type: String },
      state:   { type: String },
      country: { type: String },
      pincode: { type: String },
    },
  },
  { timestamps: true }
);

const Usermodel = mongoose.model("user", UserSchema);
export default Usermodel;
