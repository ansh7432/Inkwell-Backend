const UserModel = require("../models/User.js");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const secretKey = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
const multer = require("multer");

const Storage = multer.diskStorage({
  destination: "./uploads", // Provide the desired destination folder path
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: Storage }).single("file");

const BlogModel = require("../models/Post.js");
const { json } = require("express");

async function getTestRoute(req, res) {
  res.json({
    test: "Ok",
  });
}

async function postRegisterRoute(req, res) {
  const { username, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, salt);
  //   check if it exist then show try some other user name
  
  try {
    const user = new UserModel({
      username,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed or already exist with this username",
      error: err,
    });
  }
}

async function postLoginRoute(req, res) {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    console.log(password);
    if (!user) {
      console.log("User not found redirect to register page.");
      return res.status(401).json({
        message: "User not found redirect to register page.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Password incorrect",
      });
    }

    console.log("Login Success");

    const token = jwt.sign({ username, id: user._id }, secretKey, {
      expiresIn: "1h",
    });

    res
      .cookie("token", token, {
        maxAge: 3600000,
        httpOnly: true,
      })
      .status(200)
      .json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
    });
  }
}

async function getHomeRoute(req, res) {
  res.send("<h1>Welcome to the home route</h1>");
}

async function authRoute(req, res) {
  const auth = req.headers.authorization;

  try {
    const parts = auth.split(" ");
    const token = parts[1];
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded);

    delete decoded.password;

    res.status(200).json(decoded);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
}

async function uploadRoute(req, res, next) {
  const auth = req.headers.authorization;

  try {
    upload(req, res, (err) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(500).json({ error: "Error during file upload" });
      }

      try {
        const { title, summary, content } = req.body;

        const parts = auth.split(" ");
        const token = parts[1];

        const decoded = jwt.verify(token, secretKey);

        const userId = decoded.id;

        const newBlogPost = new BlogModel({
          title,
          summary,
          content,
          author: userId,
        });

        newBlogPost
          .save()
          .then(() => {
            console.log("Data saved to MongoDB");
            res.status(201).json({
              message: "Data saved to MongoDB",
            });
          })
          .catch((err) => {
            console.error("Error while saving data to MongoDB:", err);
            res.status(500).json({
              message: "Data not posted",
              error: err,
            });
          });
      } catch (err) {
        console.error("Error during processing:", err);
        res.status(500).json({ error: "Error during processing" });
      }
    });
  } catch (err) {
    console.error("Error outside try-catch block:", err);
    res.status(500).json({ error: "Error outside try-catch block" });
  }
}

``;

async function getUploadRoute(req, res) {
  const auth = req.headers.authorization;

  try {
    const parts = auth.split(" ");
    const token = parts[1];
    const decoded = jwt.verify(token, secretKey);
    const response = await BlogModel.find({ author: decoded.id });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      message: "Unable to fetch your posts.",
    });
  }
}
// rendering users without login
async function render(req, res) {
  try {
    const response = await BlogModel.find();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      message: "Unable to fetch your posts",
    });
  }
}
//
async function getUsername(req, res) {
  const auth = req.headers.authorization;

  try {
    const parts = auth.split(" ");
    const token = parts[1];
    const decoded = jwt.verify(token, secretKey);

    res.status(200).json(decoded.username);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Server error",
    });
  }
}

module.exports = {
  getTestRoute,
  postRegisterRoute,
  getHomeRoute,
  postLoginRoute,
  authRoute,
  uploadRoute,
  getUploadRoute,
  getUsername,
  render,
};
