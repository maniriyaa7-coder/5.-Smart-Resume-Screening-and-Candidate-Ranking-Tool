import mongoose from 'mongoose';

const connectDatabase = async () => {
  // Validate MongoDB URI
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  // Clean up any whitespace from URI
  const mongoURI = process.env.MONGODB_URI.trim();

  console.log('🔄 Attempting to connect to MongoDB Atlas...');
  console.log('📍 Connection string prefix:', mongoURI.substring(0, 30) + '...');

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      bufferCommands: false, // Disable buffering - fail fast instead
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📦 Database Host: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}`);
    console.log(`📦 Connection State: ${conn.connection.readyState}`);

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('✅ Mongoose connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('\n========== DATABASE CONNECTION ERROR ==========');
    console.error('❌ Failed to connect to MongoDB Atlas\n');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    
    if (error.name === 'MongoServerSelectionError' || error.code === 'ECONNREFUSED') {
      console.error('\n📋 TROUBLESHOOTING CHECKLIST:');
      console.error('1. ⭐ Try standard connection string (not SRV format):');
      console.error('   - Go to MongoDB Atlas → Connect → Standard connection string');
      console.error('   - Update MONGODB_URI in .env file');
      console.error('2. Verify MongoDB Atlas cluster is running (not paused)');
      console.error('3. Check Network Access in MongoDB Atlas:');
      console.error('   - Go to Network Access tab');
      console.error('   - Add IP Address: 0.0.0.0/0 (Allow from anywhere) for testing');
      console.error('4. Verify Database Access credentials:');
      console.error('   - Username: riya');
      console.error('   - Password: correct in .env file');
      console.error('5. Check if firewall/antivirus is blocking connection');
      console.error('6. Try from different network (mobile hotspot)');
      console.error('7. Change DNS server to Google DNS (8.8.8.8, 8.8.4.4)');
    }
    
    console.error('\n===============================================\n');
    
    // Always throw error - server should not start without database
    throw error;
  }
};

export default connectDatabase;
