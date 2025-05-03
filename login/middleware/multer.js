const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Folder path where files will be uploaded
const uploadFolder = './uploads/';

// Check if the folder exists, if not, create it
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadFolder); // Save file to the "uploads" folder
    },
    filename: function(req, file, cb) {
        // Creating a unique filename by adding timestamp
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
