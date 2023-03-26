import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

export const userSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if(!name || !email || !password){
      return res
        .status(400)
        .send({ status: false, message: "Please fill all the fields" });
    }

    const findUser = await userModel.findOne({ email });

    if (findUser) {
      return res
        .status(400)
        .send({ status: false, message: "Email id is already registered" });
    }

    const mailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    if (!email.match(mailRegex))
      return res
        .status(400)
        .send({ status: false, message: "Email id is not valid." });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hash,
    });

    await newUser.save();
    return res.status(201).send({
      status: true,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id),
      message: "User has been created",
    });
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = await userModel.findOne({ email: email });

    if (!findUser) {
      return res
        .status(404)
        .json({ status: false, message: "User is not found" });
    }

    const mailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    if (!email.match(mailRegex))
      return res
        .status(400)
        .send({ status: false, message: "Email id is not valid." });

    const isPasswordCorrect = bcrypt.compareSync(password, findUser.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .send({ status: false, message: "Email or Password is wrong" });
    }

    return res.status(200).send({
      status: true,
      message: "User logged in successfully",
      name: findUser.name,
      email: findUser.email,
      token: generateToken(findUser._id),
    });
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user);

    const { name, email, password } = req.body;

    const duplicatEmail = await userModel.find({ email: email });
      if (duplicatEmail.length) {
        return res
          .status(400)
          .send({ status: false, message: "Email id is already registered." });
      }

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      if (password) {
        user.password = hash;
      }

      const updatedUser = await user.save();

      return res.status(200).send({
        status: true,
        message: "User updated successfully",
        name: updatedUser.name,
        email: updatedUser.email,
        token: generateToken(updatedUser._id),
      });
    } else {
      return res
        .status(404)
        .json({ status: false, message: "User is not found" });
    }
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).send({ status: false, message: error.message });
  }
};
