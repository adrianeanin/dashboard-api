const User = require("../models/user");
const { hashPassword } = require("../utils/encryption");
const yup = require("yup");
const { body } = require("express-validator");
require("express-async-errors");

// Validation
const registerSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  isAdmin: yup.boolean(),
});

const addUser = [
  // Sanitization
  body("name").trim().escape(),
  body("email").trim().escape(),
  body("password").trim(),
  async (req, res) => {
    const validatedData = await registerSchema.validate(req.body, {
      abortEarly: false,
    });

    const existingUser = await User.findOne({
      where: { email: validatedData.email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hash = await hashPassword(validatedData.password);

    const newUser = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hash,
      isAdmin: validatedData.isAdmin || false,
    });

    res.status(201).json({
      data: {
        user: {
          name: newUser.name,
          email: newUser.email,
        },
      },
      _msg: "User added successfully",
    });
  },
];

module.exports = {
  addUser,
};
