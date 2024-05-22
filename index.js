const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser'); // Import body-parser

const upload = multer({ dest: 'uploads/' });

// Configure Cloudinary with your account details
cloudinary.config({
  cloud_name: 'domhrpxzy',
  api_key: '817386734969214',
  api_secret: 'yzx91ItaCW2-FrsCBPCIgTOOGsc'
});

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Use body-parser middleware

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

    // Save URLs to a JSON file
    const jsonFilePath = 'image-urls.json';
    let existingUrls = [];
    if (fs.existsSync(jsonFilePath)) {
      const fileData = fs.readFileSync(jsonFilePath, 'utf-8');
      existingUrls = JSON.parse(fileData);
    }
    const updatedUrls = [...existingUrls, ...imageUrls];
    fs.writeFileSync(jsonFilePath, JSON.stringify(updatedUrls, null, 2));

    res.json({ imageUrls });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading images' });
  }
});

// New route to get the saved links from the JSON file
app.get('/links', (req, res) => {
  const jsonFilePath = 'image-urls.json';
  if (fs.existsSync(jsonFilePath)) {
    const fileData = fs.readFileSync(jsonFilePath, 'utf-8');
    const savedLinks = JSON.parse(fileData);
    res.json(savedLinks);
  } else {
    res.status(404).json({ error: 'No saved links found' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});