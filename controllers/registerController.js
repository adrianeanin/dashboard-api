const User = require("../models/user");
const { hashPassword } = require("../utils/encryption");

const registerSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  isAdmin: yup.boolean(),
});

async function registerUser(req, res) {
  const validatedData = await registerSchema.validate(req.body, {
    abortEarly: false,
  });

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
    _msg: "User registered successfully",
  });
}

module.exports = {
  registerUser,
};
