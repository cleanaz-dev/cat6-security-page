import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dmllgn0t7', // Your cloud name
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Set to true to use HTTPS
});

export async function uploadPdfToCloudinary(pdfBuffer, quoteId) {
  try {
    // Convert buffer to a readable stream
    const stream = Readable.from(pdfBuffer);

    // Upload PDF to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto', // Specify non-image file
          public_id: quoteId, // Dynamic public ID for organization
          format: 'pdf', // Ensure file is treated as PDF
          upload_preset: 'spaujw6j'
        },
        (error, result) => {
          if (error) {
            console.error('Error uploading PDF to Cloudinary:', error);
            return reject(new Error('Failed to upload PDF'));
          }
          resolve(result);
        }
      );

      // Pipe the buffer stream to Cloudinary
      stream.pipe(uploadStream);
    });

    console.log('PDF uploaded successfully:', result);
    return { url: result.secure_url } ; // Return the secure URL of the uploaded PDF
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}