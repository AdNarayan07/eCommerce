const Product = require("../models/product");
const Comment = require("../models/comment");
const Order = require("../models/order");

const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const outputDir = path.join(__dirname, "../database/product_images");

// Deletes images associated with a product by name
exports.deleteImage = (name) => {
  return new Promise((resolve, reject) => {
    // Read the output directory for files
    fs.readdir(outputDir, (err, files) => {
      if (err) return reject(err);
      // Filter files that match the name pattern
      const matchingFiles = files.filter((file) => file.startsWith(name + "."));

      // Delete each matching file
      const deletePromises = matchingFiles.map((file) => {
        return new Promise((delResolve, delReject) => {
          fs.unlink(path.join(outputDir, file), (err) => {
            if (err) {
              delReject(err);
            } else {
              delResolve();
            }
          });
        });
      });
      // Wait for all delete promises to complete
      Promise.all(deletePromises).then(resolve).catch(reject);
    });
  });
};

// Saves an image from a data URI to the output directory
const saveImageFromDataURI = (dataURI, name) => {
  return new Promise((resolve, reject) => {
    // Validate the data URI format
    if (!dataURI?.startsWith("data:image/")) {
      return reject(new Error("Invalid data URI: \n" + dataURI));
    }

    // Split the data URI into parts
    const parts = dataURI.split(",");
    const base64Data = parts[1];

    // Get MIME type and extension from the data URI
    const mimeType = parts[0].match(/^data:([^;]+);base64/)[1]; // Extract the MIME type
    const extension = mime.extension(mimeType); // Get the corresponding file extension
    const outputPath = path.join(outputDir, `${name}.${extension}`); // Construct output file path

    // First, delete any existing images with the same name
    exports.deleteImage(name)
      .then(() => {
        const buffer = Buffer.from(base64Data, "base64"); // Convert base64 data to buffer

        // Write the buffer to a file
        fs.writeFile(outputPath, buffer, (err) => {
          if (err) {
            return reject(err); // Reject promise on error
          } else {
            return resolve(outputPath); // Resolve promise with the output path
          }
        });
      })
      .catch(reject); // Handle any errors from deletion
  });
};

// Creates a new product
exports.createProduct = async (req, res) => {
  const { name, price, quantity, image, shortDescription, detailedDescription } = req.body; // Extract product details from request body
  const seller = req.user.username; // Get seller's username from request

  try {
    // Create a new product in the database
    const newProduct = await Product.create({
      name,
      price,
      quantity,
      seller,
      shortDescription,
      detailedDescription,
    });
    // If an image is provided, save it
    if (image) await saveImageFromDataURI(image.data, newProduct.id);

    res.json(newProduct); // Respond with the newly created product
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating product" }); // Handle errors
  }
};

// Updates an existing product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, quantity, image, shortDescription, detailedDescription } = req.body; // Extract product details from request body
    const seller = req.user.username; // Get seller's username from request
    const { id } = req.params; // Get product ID from request params

    // Find the product by its ID
    const product = await Product.findByPk(id);
    
    // Handle case where product is not found
    if (!product) return res.status(404).json({ message: "Could not find the product" });
    // Prevent seller from updating their own product
    if (product.seller !== seller) return res.status(403).json({ message: "Access Denied" });

    // If an image is provided
    if (image) {
      if(image === "!remove") {
        await exports.deleteImage(id); // Delete the image if the request indicates removal
      } else {
        await saveImageFromDataURI(image, id); // Save the new image
      }
    }

    // Update product details
    product.set({ name, price: parseFloat(price), quantity: parseInt(quantity), shortDescription, detailedDescription });
    await product.save(); // Save the updated product

    res.json(product); // Respond with the updated product
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating the product" }); // Handle errors
  }
};

// Deletes a product
exports.deleteProduct = async (req, res) => {
  try {
    const seller = req.user.username; // Get seller's username from request
    const { id } = req.params; // Get product ID from request params

    // Find the product by its ID
    const product = await Product.findByPk(id);
    // Handle case where product is not found
    if (!product) return res.status(404).json({ message: "Could not find the product" });
    // Prevent seller from deleting their own product
    if (product.seller !== seller) return res.status(403).json({ message: "Access Denied" });

    await product.destroy(); // Delete the product from the database
    res.json({ message: "Product deleted successfully" }); // Respond with success message
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting the product" }); // Handle errors
  }
}

// Retrieves all products for the seller
exports.getProducts = async (req, res) => {
  try {
    const seller = req.user?.username; // Get seller's username from request
    // Find all products for the seller, or all products if not logged in
    let products = await Product.findAll(seller ? { where: { seller } } : {});
    res.json(products); // Respond with the list of products
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products" }); // Handle errors
  }
};

// Retrieves a single product by ID
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params; // Get product ID from request params
    const product = await Product.findByPk(id); // Find product by ID
    res.json(product); // Respond with the product details
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching the product" }); // Handle errors
  }
};

// Processes a purchase for a product
exports.buyProduct = async (req, res) => {
  const { id } = req.params; // Get product ID from request params
  const { username } = req.user; // Get username from authenticated user
  const { quantity, price, deliveryFee } = req.body; // Extract purchase details from request body
  console.log(quantity); // Debugging log for quantity

  try {
    const product = await Product.findByPk(id); // Find product by ID
    // Handle case where product is not found
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Prevent the seller from buying their own product
    if (product.seller === req.user.username) {
      return res.status(403).json({ message: "You can't purchase your own product" });
    }

    // Handle case where requested quantity exceeds available stock
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    product.quantity -= quantity; // Update product stock
    await product.save(); // Save updated product stock

    // Create a new order for the purchase
    const newOrder = await Order.create({
      quantity,
      price,
      deliveryFee,
      status: "Placed",
      productId: product.id,
      username,
    });

    res.json(newOrder); // Respond with the new order details
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error buying product" }); // Handle errors
  }
};

// Retrieves comments associated with a product
exports.getComments = async (req, res) => {
  try {
    // Find all comments for the given product ID
    const comments = await Comment.findAll({ where: { productId: req.params.id } });
    res.json(comments); // Respond with the list of comments
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching comments" }); // Handle errors
  }
};

// Adds or updates a comment for a product
exports.addOrUpdateComment = async (req, res) => {
  try {
    const { username } = req.user; // Get the username from the authenticated user
    const { content } = req.body; // Get the content of the comment from the request body
    const productId = req.params.id; // Get the product ID from the request params

    // Find the product by its ID
    const product = await Product.findByPk(productId);
    // Handle case where product is not found
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Prevent the seller from commenting on their own product
    if (product.seller === username) {
      return res.status(403).json({ message: "You can't comment on your own product" });
    }

    // Check if the user has an order for the given product
    const hasOrdered = await Order.findOne({
      where: {
        productId,
        username,
      },
    });

    // Ensure the user has purchased the product before allowing comments
    if (!hasOrdered) {
      return res.status(403).json({ message: "You can only comment on products you've purchased" });
    }

    // Check if the user already has a comment on the product
    let userComment = await Comment.findOne({
      where: {
        productId,
        username,
      },
    });

    if (userComment) {
      // If the comment exists, update it
      userComment.content = content;
      await userComment.save(); // Save the updated comment
      return res.json({ message: "Comment updated", comment: userComment }); // Respond with updated comment
    } else {
      // If no comment exists, create a new one
      const newComment = await Comment.create({
        productId,
        username,
        content,
      });
      return res.json({ message: "Comment added", comment: newComment }); // Respond with new comment
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding or updating comment" }); // Handle errors
  }
};
