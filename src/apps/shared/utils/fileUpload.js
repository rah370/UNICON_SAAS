// File upload utility

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function uploadFile(file, uploadType = "document") {
  const token = localStorage.getItem("uniconToken");
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_type", uploadType);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type, browser will set it with boundary for FormData
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Upload failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
}

export function validateFile(file, maxSize = 5 * 1024 * 1024, allowedTypes = []) {
  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB` };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} not allowed` };
  }

  return { valid: true };
}

