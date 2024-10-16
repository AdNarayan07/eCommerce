const Product = require("../models/product");
const Comment = require("../models/comment");
const Order = require("../models/order");

const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const outputDir = path.join(__dirname, "../database/product_images");

exports.deleteImage = (name) => {
  return new Promise((resolve, reject) => {
    fs.readdir(outputDir, (err, files) => {
      if (err) return reject(err);
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
      Promise.all(deletePromises).then(resolve).catch(reject);
    });
  });
};

const saveImageFromDataURI = (dataURI, name) => {
  return new Promise((resolve, reject) => {
    if (!dataURI?.startsWith("data:image/")) {
      return reject(new Error("Invalid data URI: \n" + dataURI));
    }

    const parts = dataURI.split(",");
    const base64Data = parts[1];

    // Create the output path with the appropriate extension
    const mimeType = parts[0].match(/^data:([^;]+);base64/)[1]; // Get the MIME type
    const extension = mime.extension(mimeType);
    const outputPath = path.join(outputDir, `${name}.${extension}`); // Set the output path

    // First, delete all files with the same name (no matter the extension)
    exports.deleteImage(name)
      .then(() => {
        const buffer = Buffer.from(base64Data, "base64");

        // Write the buffer to a file
        fs.writeFile(outputPath, buffer, (err) => {
          if (err) {
            return reject(err); // Reject the promise on error
          } else {
            return resolve(outputPath); // Resolve the promise on success
          }
        });
      })
      .catch(reject); // Handle any deletion errors
  });
};

exports.createProduct = async (req, res) => {
  const { name, price, quantity, image, shortDescription, detailedDescription } = req.body;
  const seller = req.user.username;

  try {
    const newProduct = await Product.create({
      name,
      price,
      quantity,
      seller,
      shortDescription,
      detailedDescription,
    });
    if (image) await saveImageFromDataURI(image.data, newProduct.id);

    res.json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, quantity, image, shortDescription, detailedDescription } = req.body;
    const seller = req.user.username;
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) return res.status(404).json({ message: "Could not find the product" });
    if (product.seller !== seller) return res.status(403).json({ message: "Access Denied" });

    if (image) {
      if(image === "!remove") await exports.deleteImage(id);
      else await saveImageFromDataURI(image, id);
    }

    product.set({ name, price: parseFloat(price), quantity: parseInt(quantity), shortDescription, detailedDescription });
    await product.save();

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating the product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const seller = req.user.username;
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Could not find the product" });
    if (product.seller !== seller) return res.status(403).json({ message: "Access Denied" });

    await product.destroy();
    res.json({ message: "Product deleted successfully" })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting the product" });
  }
}

exports.getProducts = async (req, res) => {
  try {
    const seller = req.user?.username;
    let products = await Product.findAll(seller ? { where: { seller } } : {});
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products" });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching the product" });
  }
};

exports.buyProduct = async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;
  const { quantity, price, deliveryFee } = req.body;
  console.log(quantity);

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Prevent the seller from buying their own product
    if (product.seller === req.user.username) {
      return res.status(403).json({ message: "You can't purchase your own product" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    product.quantity -= quantity;
    await product.save();

    const newOrder = await Order.create({
      quantity,
      price,
      deliveryFee,
      status: "Placed",
      productId: product.id,
      username,
    });

    res.json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error buying product" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({ where: { productId: req.params.id } });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching comments" });
  }
};

exports.addOrUpdateComment = async (req, res) => {
  try {
    const { username } = req.user; // Get the username from the authenticated user
    const { content } = req.body; // Get the content of the comment from the request body
    const productId = req.params.id; // Get the product ID from the request params

    const product = await Product.findByPk(productId);
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
      await userComment.save();
      return res.json({ message: "Comment updated", comment: userComment });
    } else {
      // If no comment exists, create a new one
      const newComment = await Comment.create({
        productId,
        username,
        content,
      });
      return res.json({ message: "Comment added", comment: newComment });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding or updating comment" });
  }
};
