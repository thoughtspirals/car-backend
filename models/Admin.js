const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Name is required"],
    },

    name: {
      type: String,
      required: [true, "Name is required"],
    },

    title: {
      type: String,
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: {
      type: String,
      required: [true],
      minlength: [10],
    },

    employeeId: {
      type: String,
      unique: true,
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// Generate a unique 10-digit employee ID
adminSchema.pre("save", async function (next) {
  if (!this.employeeId) {
    let employeeId = Math.floor(
      1000000000 + Math.random() * 900000000
    ).toString();
    let admin = await Admin.findOne({ employeeId });
    while (admin) {
      employeeId = Math.floor(
        1000000000 + Math.random() * 900000000
      ).toString();
      admin = await Admin.findOne({ employeeId });
    }
    this.employeeId = employeeId;
  }
  next();
});

// Compare passwords
adminSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Error comparing passwords");
  }
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
