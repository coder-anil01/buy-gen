// const cloudinaryImagesUploads = async (file) => {
//   if (!file) {
//     throw new Error("Please select an image");
//   }

//   // const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
//   // const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
//   const cloudName = "pbykkmdq"
//   const uploadPreset = "ByGenz";

//   if (!cloudName || !uploadPreset) {
//     throw new Error("Cloudinary configuration is missing");
//   }

//   const formData = new FormData();

//   formData.append("file", file);
//   formData.append("upload_preset", uploadPreset);

//   const response = await fetch(
//     `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//     {
//       method: "POST",
//       body: formData,
//     },
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.error?.message || "Image upload failed");
//   }

//   return {
//     // url: data.secure_url,
//     // publicId: data.public_id,
//     data: data, // Return the entire response data for debugging
//   };
// };

// export default cloudinaryImagesUploads;




// const cloudName = "pbykkmdq";
// const uploadPreset = "ByGenz";


const cloudinaryImagesUploads = async (files) => {
  if (!files || files.length === 0) {
    throw new Error("Please select an image");
  }

  const fileArray = Array.isArray(files) ? files : [files];

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration is missing");
  }

  const uploadPromises = fileArray.map(async (item) => {
    const file = item.file || item;

    if (!(file instanceof File)) {
      throw new Error("Invalid image file");
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || "Image upload failed"
      );}

    return {
      url: data.secure_url,
      publicId: data.public_id,
      // responseData: data, // Return the entire response data for debugging
    };
  });

  return await Promise.all(uploadPromises);
};

export default cloudinaryImagesUploads;