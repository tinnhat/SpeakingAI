import mongoose from 'mongoose'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env file')
}

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise()
    }

    return await mongoose.connect(process.env.MONGODB_URI!)
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}
