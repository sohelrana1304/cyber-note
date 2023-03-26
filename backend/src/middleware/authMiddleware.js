import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userAuth = async function (req, res, next) {
  try {
    // Taking token from header
    const authHeader = req.headers.authorization;
    // console.log(authHeader)

    // If token is not present then is response message will displayed.
    if (authHeader === undefined) {
      return res.status(401).send({
        status: false,
        message: "User is Unauthorized",
      });
    }

    const token = req.headers.authorization.split(" ")[1];

    // Varifing token
    const verifyToken = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decode) => {
        if (err) {
          if (err.name === "JsonWebTokenError") {
            return res.status(401).send({ msg: "User is Unauthorized" });
          } else {
            return res.status(401).send({ msg: err.message });
          }
        } else {
          req.user = decode.id;
          next();
        }
      }
    );
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
};
