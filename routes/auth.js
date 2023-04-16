const router = require("express").Router();
const { User, Admin } = require("../models/user");
const { Flight } = require("../models/plain");

const bcrypt = require("bcryptjs");
const Joi = require("joi");

router.get("/", (req, res) => {
  res.send("HELLO");
});

router.post("/log", async (req, res) => {
  console.log(req.body);
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).send("Invalid Email or Password" );
    const validPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!validPassword)
      return res.status(401).send( "Invalid Email or Password" );
      
    res.status(200).send({ message: "logged in successfully",userId:user._id });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" + error.message });
  }
});
router.post("/admin/log", async (req, res) => {
  console.log(req.body);
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await Admin.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).send("Invalid Email or Password" );
    const validPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!validPassword)
      return res.status(401).send( "Invalid Email or Password" );
      
    res.status(200).send({ message: "logged in successfully",userId:user._id });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" + error.message });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

//const bcrypt = require("bcryptjs");
router.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });
    // const hashPassword = await bcrypt.hash(req.body.password, salt);
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
    console.log(hashedPassword);
    await new User({ ...req.body, password: hashedPassword })
      .save()
      .then((savedData) => {
        res.status(201).send({data:savedData,message:"Registered successfully"});
        
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Internal server error");
      });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.post("/admin/register", async (req, res) => {
  console.log(req.body);
  try {
    let user = await Admin.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });
    // const hashPassword = await bcrypt.hash(req.body.password, salt);
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
    console.log(hashedPassword);
    await new Admin({ ...req.body, password: hashedPassword })
      .save()
      .then((savedData) => {
        res.status(201).send({data:savedData,message:"Registered successfully"});
        
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Internal server error");
      });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
