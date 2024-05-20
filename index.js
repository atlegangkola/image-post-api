const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors'); // Import cors
const upload = multer({ dest: 'uploads/' });

// Configure Cloudinary with your account details
cloudinary.config({
  cloud_name: 'domhrpxzy',
  api_key: '817386734969214',
  api_secret: 'yzx91ItaCW2-FrsCBPCIgTOOGsc'
});

const app = express();
app.use(cors()); // Enable CORS for all routes

// Function to upload an image to Cloudinary
const uploadImage = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'your_folder_name',
    });
    console.log('Image uploaded successfully:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Route to handle image upload
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = await uploadImage(req.file.path);
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading image' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});