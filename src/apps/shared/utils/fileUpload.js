// Image upload utility
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function uploadImage(file, type = "general") {
  const token = localStorage.getItem("uniconToken");
  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", type);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Upload failed: ${response.status}`);
    }

    return data.url || data.image_url || data.path;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
}

export async function uploadMultipleImages(files, type = "general") {
  const uploadPromises = Array.from(files).map((file) => uploadImage(file, type));
  return Promise.all(uploadPromises);
}

// Compress image before upload (client-side)
export function compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          file.type,
          quality
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
