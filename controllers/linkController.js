const Link = require("../models/link");
const yup = require("yup");
require("express-async-errors");

const linkSchema = yup.object().shape({
  name: yup.string().required(),
  icon: yup.string().required(),
  url: yup.string().required(),
});

async function createLink(req, res) {
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
}

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
      .json({ data: { link: link }, _msg: "A single link in the db" });
  } else {
    res.status(404).json({ error: "Link not found" });
  }
}

async function updateLink(req, res) {
  const linkId = req.params.id;

  const validatedData = await linkSchema.validate(req.body, {
    abortEarly: false,
  });
  const [updatedRowsCount, updatedLink] = await Link.update(validatedData, {
    where: { id: linkId },
    returning: true,
  });

  if (updatedRowsCount > 0) {
    res.status(200).json({
      data: { link: updatedLink[0] },
      _msg: "Link updated successfully",
    });
  } else {
    res.status(404).json({ error: "Link not found" });
  }
}

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
