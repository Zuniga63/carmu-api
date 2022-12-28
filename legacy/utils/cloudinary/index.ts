import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import profilePreset from './createProfilePreset';
import categoryPreset from './createCategoryPreset';
import tagPreset from './createTagPreset';
import productPreset from './createProductPreset';

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

profilePreset();
categoryPreset();
tagPreset();
productPreset();
