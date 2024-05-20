const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const upload = multer({ dest: 'uploads/' });

// Configure Cloudinary with your account details
cloudinary.config({
  cloud_name: 'domhrpxzy',
  api_key: '817386734969214',
  api_secret: 'yzx91ItaCW2-FrsCBPCIgTOOGsc'
});

const app = express();
app.use(cors());

// Function to upload images to Cloudinary
const uploadImages = async (imagePaths) => {
  try {
    const uploadedImages = [];
    for (const imagePath of imagePaths) {
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: 'your_folder_name',
      });
      uploadedImages.push(result.secure_url);
    }
    console.log('Images uploaded successfully');
    return uploadedImages;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

// Route to handle image upload
app.post('/upload', upload.array('images'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    const imagePaths = req.files.map((file) => file.path);
    const imageUrls = await uploadImages(imagePaths);
    res.json({ imageUrls });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading images' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});