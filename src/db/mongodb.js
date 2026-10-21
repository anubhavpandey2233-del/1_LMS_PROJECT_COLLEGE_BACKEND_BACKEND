
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

let isConnected = false;

const mongodb = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log('✅ Using existing MongoDB connection');
        return;
    }

    console.log('🔄 Connecting to MongoDB...');

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            maxPoolSize: 10,
            bufferCommands: true,
        });

        isConnected = true;
        console.log('✅ MongoDB Connected:', mongoose.connection.host);
    } catch (error) {
        isConnected = false;
        console.error('❌ MongoDB connection FAILED:', error.message);
        throw error;
    }
};

module.exports = mongodb;
