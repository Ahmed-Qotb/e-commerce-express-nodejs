import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "user name is required"],
      minLength: [2, "user name must be bigger than 2 charachters"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      required: true,
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    }, // otp time 1 min

    profilePic: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dvwxicol1/image/upload/v1708099493/e%20commerce/users/defaults/profile%20pecture/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69_ptetny.webp",
      },
      id: {
        type: String,
        default:
          "e%20commerce/users/defaults/profile%20pecture/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69_ptetny",
      },
    },
    coverimages: [
      {
        url: {
          type: String,
        },
        id: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// ? hashign password after save()
userSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(
      this.password,
      parseInt(process.env.HASH_ROUNDS)
    );
  }
});

export const userModel = mongoose.model("user", userSchema);
