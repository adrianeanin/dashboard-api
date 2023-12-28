const yup = require("yup");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../utils/config");
const { comparePasswords } = require("../utils/encryption");

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

async function loginUser(req, res) {
  const validatedData = await loginSchema.validate(req.body, {
    abortEarly: false,
  });

  const user = await User.findOne({
    where: {
      email: validatedData.email,
    },
  });

  const passwordCorrect =
    user === null
      ? false
      : await comparePasswords(validatedData.password, user.password);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    email: user.email,
    id: user.id,
  };

  const token = jwt.sign(userForToken, config.SECRET, {
    expiresIn: "2h",
  });

  res.status(200).send({
    data: {
      name: user.name,
      email: user.email,
      token,
    },
    _msg: "Login successful",
  });
}

module.exports = { loginUser };
