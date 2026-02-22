const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    fileId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    localUrl: {
        type: String
    },
    isVisible: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Image', ImageSchema);
