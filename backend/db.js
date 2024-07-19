const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://rohitravi47:rohitravi47@mern.myhidt7.mongodb.net/?retryWrites=true&w=majority&appName=mern', {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // serverSelectionTimeoutMS: 10000, // Set timeout for server selection
            // ssl: true, // Ensure SSL is enabled
            // sslValidate: false, // Optional: Disable SSL certificate validation (not recommended for production)
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
