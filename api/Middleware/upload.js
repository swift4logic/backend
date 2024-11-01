const multer = require('multer');
const path = require('path');

// Define storage location and filename format
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Format the file name to avoid conflicts
  },
});

// Initialize upload
const upload = multer({ storage });

module.exports = upload;
