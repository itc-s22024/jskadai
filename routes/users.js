import express from "express";

const {check, validationResult} = require("express-validator");
const scrypt = require("../util/scrypt");
const router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", [
  check("name", "NAME は必ず入力してください。").notEmpty(),
  check("pass", "PASSWORD は必ず入力してください。").notEmpty(),
], async (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const messages = result.array();
    const data = {
      title: "Users/Signup",
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      messages,
    };
    res.render("users/signup", data);
    return;
  }
  const {name, pass} = req.body;
  const salt = scrypt.generateSalt();
  const hashedPassword = scrypt.calcHash(pass, salt);
  await prisma.user.create({
    data: {
      name,
      password: hashedPassword,
      salt,
    }
  });
  res.redirect("/users/login");
});

export default router;