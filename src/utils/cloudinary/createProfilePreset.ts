/* eslint-disable no-console */
import { v2 as cloudinary } from 'cloudinary';

export default async function createProfilePhotosPreset(): Promise<void> {
  try {
    const preset = await cloudinary.api.create_upload_preset({
      name: 'carmu_profile_photo_preset',
      folder: 'carmu/profile_photos',
      resource_type: 'image',
      allowed_formats: 'jpg, png, gif, webp, bmp, jpe, jpeg',
      access_mode: 'public',
      unique_filename: true,
      auto_tagging: 0.7,
      overwrite: true,

      transformation: [
        {
          width: 200,
          height: 200,
          crop: 'thumb',
          gravity: 'face',
        },
      ],
    });

    console.log(preset);
  } catch (error: any) {
    console.error(error.error.message);
  }
}
