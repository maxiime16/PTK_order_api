import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_ORDER_URI = process.env.MONGODB_ORDER_URI;

// Configuration de la connexion
export async function connectDB() {
  try {
    if (!MONGODB_ORDER_URI) {
      throw new Error('MONGODB_URI_ORDER is not defined in the environment variables.');
    }
    await mongoose.connect(MONGODB_ORDER_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // Les options peuvent varier selon la version de mongoose
    });
    console.log('🟢 1/2 - Connected to MongoDB (orders-db)');
  } catch (error) {
    console.error('❌ Failed to connect MongoDB', error);
    process.exit(1);
  }
}
