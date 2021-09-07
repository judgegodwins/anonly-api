import mongoose from "mongoose";

async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);

  // console.log(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];

    try {
      await collection.drop();
    } catch (e) {
      if (e.message == 'ns not found') return
      if (e.message.includes('a background operation is currently running')) return
      console.log(e.message);

    }
  }
} 

afterAll(async () => {
  await dropAllCollections();
  await mongoose.connection.close();
})