const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function uploadImage(file) {
  try {
    const uploadResult = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return uploadResult;
  } catch (error) {
    console.log(error);
  }
}

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = { upload, uploadImage };
