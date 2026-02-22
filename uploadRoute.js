const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageKit = require('imagekit');
const Image = require('./imageModel');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

// ImageKit configuration
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Multer configuration for disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// @route   POST /upload
// @desc    Upload image to ImageKit and save metadata to MongoDB
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to ImageKit
        const result = await imagekit.upload({
            file: fs.readFileSync(req.file.path),
            fileName: req.file.originalname,
            folder: '/wedding-invitation'
        });

        // Save to MongoDB
        const newImage = new Image({
            url: result.url,
            fileId: result.fileId,
            name: result.name,
            localUrl: `/images/${req.file.filename}`
        });

        await newImage.save();

        res.status(200).json({
            message: 'Image uploaded successfully',
            data: newImage
        });
    } catch (err) {
        console.error('Upload error:', err.message);
        res.status(500).json({ message: 'Server error during upload' });
    }
});

// @route   GET /api/upload
// @desc    Get all uploaded images
router.get('/', async (req, res) => {
    try {
        const images = await Image.find().sort({ uploadedAt: -1 });
        res.status(200).json(images);
    } catch (err) {
        console.error('Fetch error:', err.message);
        res.status(500).json({ message: 'Server error while fetching images' });
    }
});

module.exports = router;
