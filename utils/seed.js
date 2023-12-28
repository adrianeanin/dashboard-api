const sequelize = require("./database");
const config = require("./config");
const User = require("../models/user");
const yup = require("yup");
const { hashPassword } = require("../utils/encryption");

const adminSchema = yup.object().shape({
  adminName: yup.string().required(),
  adminEmail: yup.string().email().required(),
  adminPassword: yup.string().required(),
});

const seedAdmin = async () => {
  try {
    await adminSchema.validate(config, { abortEarly: false });

    const adminName = config.adminName;
    const adminEmail = config.adminEmail;
    const adminPassword = config.adminPassword;

    const hash = await hashPassword(adminPassword);

    await User.create({
      name: adminName,
      email: adminEmail,
      password: hash,
      isAdmin: true,
    });

    console.log("Admin user seeded successfully.");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    await sequelize.close();
  }
};

seedAdmin();
