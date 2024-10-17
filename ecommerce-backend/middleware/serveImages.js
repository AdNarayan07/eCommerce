const express = require("express"); // Import the express library for creating the server and routing
const path = require("path"); // Import the path module for handling file and directory paths
const fs = require("fs"); // Import the file system module for file and directory operations

// Function to create an Express router for serving images from a specified directory
const serveImages = (imageDir) => {
  // Check if the image directory exists; if not, create it
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true }); // Create the directory and any necessary parent directories
    console.log(`Created directory: ${imageDir}`); // Log the creation of the directory
  }

  const router = express.Router(); // Create a new Express router

  // Define a route to serve product images dynamically
  router.get('/:imageName', (req, res) => {
    const { imageName } = req.params; // Extract the image name from the request parameters

    // Read the directory to find files that match the imageName
    fs.readdir(imageDir, (err, files) => {
      if (err) {
        return res.status(500).json({ message: "Error reading directory" }); // Handle errors reading the directory
      }

      // Filter files that match the base name (ignoring file extension)
      const matchingFile = files.find(file => file.split(".")[0] === imageName);

      if (!matchingFile) {
        return res.status(404).json({ message: "Image not found" }); // If no matching file is found, return 404
      }

      // Get the full path of the matching file
      const imagePath = path.join(imageDir, matchingFile);

      // Serve the image file to the client
      res.sendFile(imagePath, (sendError) => {
        if (sendError) {
          return res.status(500).json({ message: "Error sending the image" }); // Handle errors while sending the image
        }
      });
    });
  });

  return router; // Return the configured router
};

module.exports = serveImages; // Export the serveImages function
