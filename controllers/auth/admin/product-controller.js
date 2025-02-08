const { uploadImage } = require("../../helpers/cloudinary");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await uploadImage(url);
    res.json({ success: true, result, msg: "Image uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Some error occured" });
  }
};

module.exports = { handleImageUpload };
