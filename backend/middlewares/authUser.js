import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token)
      return res.json({
        success: false,
        message: "User is not authenticated",
      });

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
    } else {
      return res.json({
        success: false,
        message: "User is not authenticated",
      });
    }

    next();
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
