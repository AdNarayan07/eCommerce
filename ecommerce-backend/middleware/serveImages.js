const express = require("express");
const path = require("path");
const fs = require("fs");

const serveImages = (imageDir) => {
  // Check if the image directory exists; if not, create it
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true }); // Create the directory and any necessary parent directories
    console.log(`Created directory: ${imageDir}`);
  }

  const router = express.Router();

  // Serve product images dynamically
  router.get('/:imageName', (req, res) => {
    const { imageName } = req.params;

    // Read the directory to find files that match the imageName
    fs.readdir(imageDir, (err, files) => {
      if (err) {
        return res.status(500).json({ message: "Error reading directory" });
      }

      // Filter files that match the base name
      const matchingFile = files.find(file => file.split(".")[0] === imageName);

      if (!matchingFile) {
        return res.status(404).json({ message: "Image not found" });
      }

      // Get the full path of the matching file
      const imagePath = path.join(imageDir, matchingFile);

      // Serve the image file
      res.sendFile(imagePath, (sendError) => {
        if (sendError) {
          return res.status(500).json({ message: "Error sending the image" });
        }
      });
    });
  });

  return router;
};

module.exports = serveImages;
