import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://krishjaiswal67890:OBK2i9qT4eie1Hv2@cluster0.4bzzc6t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

console.log('Attempting to connect to MongoDB with URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
})
.then(() => {
  console.log('MongoDB connected successfully!');
  mongoose.connection.close();
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
}); 