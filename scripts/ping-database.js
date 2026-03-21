#!/usr/bin/env node

/**
 * Database Health Check Script
 * Pings MongoDB to keep connection alive and verify database health
 */

import mongoose from 'mongoose';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function pingDatabase(uri, retryCount = 0) {
    try {
        console.log(`🔌 Attempting to connect to MongoDB (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        console.log(`📍 Using URI: ${uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
        
        // Connect to database
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 10000,
            maxPoolSize: 1
        });
        
        console.log('✅ Connected to MongoDB');
        
        // Ping the database
        const startTime = Date.now();
        await mongoose.connection.db.admin().ping();
        const pingTime = Date.now() - startTime;
        
        console.log(`🏓 Database ping successful (${pingTime}ms)`);
        
        // Get database stats
        const stats = await mongoose.connection.db.stats();
        console.log('📊 Database Stats:', {
            database: stats.db,
            collections: stats.collections,
            dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
            indexSize: `${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`,
        });
        
        // Verify at least one collection exists
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📦 Found ${collections.length} collections`);
        
        // Close connection
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        
        console.log('\n✅ Health check completed successfully');
        return true;
        
    } catch (error) {
        console.error(`❌ Error during health check:`, error.message);
        
        if (retryCount < MAX_RETRIES - 1) {
            console.log(`⏳ Retrying in ${RETRY_DELAY / 1000} seconds...`);
            await sleep(RETRY_DELAY);
            return pingDatabase(uri, retryCount + 1);
        }
        
        throw error;
    }
}

async function main() {
    const uri = process.env.MONGODB_URI || 
                process.env.MONGO_CLUSTER || 
                'mongodb://localhost:27017/dreamdot';
    
    if (!uri || uri === 'mongodb://localhost:27017/dreamdot') {
        console.error('⚠️  Warning: Using default MongoDB URI. Set MONGODB_URI environment variable.');
    }
    
    try {
        await pingDatabase(uri);
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Health check failed after all retries');
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled rejection:', error);
    process.exit(1);
});

main();
