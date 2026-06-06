const multer = require('multer');

// Store the incoming file in the server's RAM (memory) instead of saving it to the hard drive
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Security check: Only allow actual PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// CORRECT EXPORT: No curly braces!
module.exports = upload;