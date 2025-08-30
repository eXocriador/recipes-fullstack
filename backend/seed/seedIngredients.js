// Run this with:
// node seed/seedIngredients.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { initMongoDB } from '../src/db/initMongoDB.js';
import { Ingredient } from '../src/db/models/ingredients/ingredient.js';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

await initMongoDB();

try {
  const dataPath = path.join(_dirname, 'ingredients.json');
  const jsonData = fs.readFileSync(dataPath, 'utf-8');
  const rawIngredients = JSON.parse(jsonData);

  const ingredients = rawIngredients.map((item) => ({
    _id: new mongoose.Types.ObjectId(item._id),
    name: item.name,
    desc: item.desc,
    img: item.img,
  }));

  await Ingredient.deleteMany({});
  await Ingredient.insertMany(ingredients);
  await mongoose.disconnect();
} catch (error) {
  process.exit(1);
}
