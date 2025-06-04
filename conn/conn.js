const mongoose = require('mongoose');

const conn = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        res.status(400).json({
            message: error.message,
            success: false
        });
    } 
    
}



module.exports = conn;
