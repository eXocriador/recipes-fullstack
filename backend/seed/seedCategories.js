// Run this with:
// node seed/seedCategories.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { initMongoDB } from '../src/db/initMongoDB.js';
import { RecipeCategory } from '../src/db/models/categories/recipeCategory.js';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

await initMongoDB();

try {
  const dataPath = path.join(_dirname, 'categories.json');
  const jsonData = fs.readFileSync(dataPath, 'utf-8');
  const rawCategories = JSON.parse(jsonData);

  const categories = rawCategories.map((item) => ({
    _id: new mongoose.Types.ObjectId(item._id.$oid),
    name: item.name,
  }));

  await RecipeCategory.deleteMany({});
  console.log('Collection cleared');

  await RecipeCategory.insertMany(categories);
  console.log('Categories seed successfully');

  await mongoose.disconnect();
  console.log('MongoDB connection closed');
} catch (error) {
  console.error('Error seeding categories:', error);
  process.exit(1);
}
