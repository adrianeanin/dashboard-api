require("express-async-errors");
const Link = require("../models/link");
const yup = require("yup");
const { body } = require("express-validator");

// Validation
const linkSchema = yup.object().shape({
  name: yup.string().required("Name is required."),
  icon: yup.string().required("Icon is required."),
  url: yup.string().required("URL is required."),
});

async function getAllLinks(req, res) {
  const links = await Link.findAll();
  res.status(200).json({ data: { links: links }, _msg: "All links in the db" });
}

async function getLinkById(req, res) {
  const linkId = req.params.id;

  const link = await Link.findByPk(linkId);

  if (link) {
    res
      .status(200)
      .json({ data: { links: link }, _msg: "A single link in the db" });
  } else {
    res.status(404).json({ error: "Link not found" });
  }
}

const createLink = [
  // Sanitization
  body("name").trim().escape(),
  body("icon").trim().escape(),
  body("url").trim().escape(),
  async (req, res) => {
    const validatedData = await linkSchema.validate(req.body, {
      abortEarly: false,
    });
    const newLink = await Link.create(validatedData);

    res.status(201).json({
      data: {
        link: newLink,
      },
      _msg: "Link created successfully",
    });
  },
];

const updateLink = [
  // Sanitization
  body("name").trim().escape(),
  body("icon").trim().escape(),
  body("url").trim().escape(),
  async (req, res) => {
    const linkId = req.params.id;

    const validatedData = await linkSchema.validate(req.body, {
      abortEarly: false,
    });

    const result = await Link.update(validatedData, {
      where: { id: linkId },
    });

    if (result) {
      res.status(200).json({
        data: { rowsUpdated: result },
        _msg: "Link updated successfully",
      });
    } else {
      res.status(404).json({ error: "Link not found" });
    }
  },
];

async function deleteLink(req, res) {
  const linkId = req.params.id;

  const deletedRowCount = await Link.destroy({ where: { id: linkId } });

  if (deletedRowCount > 0) {
    res.status(204).end();
  } else {
    res.status(404).json({ error: "Link not found" });
  }
}

module.exports = {
  createLink,
  getAllLinks,
  getLinkById,
  updateLink,
  deleteLink,
};
