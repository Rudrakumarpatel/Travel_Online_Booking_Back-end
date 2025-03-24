import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

/**
 * Upload multiple images to Cloudinary
 * @param {Array} files - Array of image files
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Array>} - Array of uploaded image URLs
 */
export const uploadImages = async (files, folder = 'holiday_packages') => {
  if (!files) return [];

  const fileArray = Array.isArray(files) ? files : [files];
  const uploadPromises = fileArray.map(file =>
    cloudinary.v2.uploader.upload(file.tempFilePath, { folder })
  );

  const results = await Promise.all(uploadPromises);
  return results.map(result => result.secure_url);
};

/**
 * Delete images from Cloudinary
 * @param {Array|string} imageUrls - Array of image URLs or a single URL
 */
export const deleteImages = async (imageUrls) => {
  if (!imageUrls) return;

  const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
  const deletePromises = urls.map(url => {
    const publicId = url.split('/').pop().split('.')[0]; // Extract publicId
    return cloudinary.v2.uploader.destroy(`holiday_packages/${publicId}`);
  });

  await Promise.all(deletePromises);
};

/**
 * Update images on Cloudinary (Delete old images, upload new ones)
 * @param {Array|string} oldUrls - Old image URLs
 * @param {Array} newFiles - New image files
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Array>} - Array of new image URLs
 */
export const updateImages = async (oldUrls, newFiles, folder = 'holiday_packages') => {
  if (oldUrls) await deleteImages(oldUrls);
  return uploadImages(newFiles, folder);
};
