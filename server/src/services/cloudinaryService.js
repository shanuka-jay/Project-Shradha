const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary');

const DEFAULT_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER || 'saddha';

function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: DEFAULT_FOLDER,
        resource_type: 'image',
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
}

async function uploadImageFiles(files, options = {}) {
  const results = await Promise.all(
    files.map((file) => uploadBufferToCloudinary(file.buffer, options))
  );

  return results.map((result) => ({
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    size: result.bytes,
    format: result.format,
    createdAt: result.created_at,
  }));
}

async function listImages(options = {}) {
  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: `${DEFAULT_FOLDER}/`,
    max_results: 200,
    resource_type: 'image',
    ...options,
  });

  return result.resources.map((resource) => ({
    url: resource.secure_url,
    publicId: resource.public_id,
    width: resource.width,
    height: resource.height,
    size: resource.bytes,
    format: resource.format,
    createdAt: resource.created_at,
  }));
}

async function deleteImage(publicId) {
  return cloudinary.uploader.destroy(publicId);
}

module.exports = {
  uploadBufferToCloudinary,
  uploadImageFiles,
  listImages,
  deleteImage,
};
