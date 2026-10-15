/**
 * Image upload and optimization utility.
 * Saves uploaded images permanently to the server disk via /api/upload.
 * Compresses oversized raw camera/phone photos for optimal web performance.
 */

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Resize high-res image (e.g. 48MP raw phone photo) to max dimension (e.g. 2400px)
 * for crisp high-density display while keeping upload fast and file sizes reasonable.
 */
export async function optimizeImageIfNeeded(file: File): Promise<string> {
  const originalDataUrl = await fileToDataUrl(file);

  // SVGs should not be altered
  if (file.type === 'image/svg+xml') {
    return originalDataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX_DIM = 2400;
      let width = img.width;
      let height = img.height;

      if (width <= MAX_DIM && height <= MAX_DIM && file.size < 2 * 1024 * 1024) {
        // Already lightweight, use original
        resolve(originalDataUrl);
        return;
      }

      if (width > height && width > MAX_DIM) {
        height = Math.round((height * MAX_DIM) / width);
        width = MAX_DIM;
      } else if (height > MAX_DIM) {
        width = Math.round((width * MAX_DIM) / height);
        height = MAX_DIM;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(originalDataUrl);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Export as high quality JPEG or PNG depending on transparency
      const format = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const optimized = canvas.toDataURL(format, 0.92);
      resolve(optimized);
    };
    img.onerror = () => {
      resolve(originalDataUrl);
    };
    img.src = originalDataUrl;
  });
}

/**
 * Uploads an image file to the backend server disk storage.
 * Returns the permanent static URL (e.g. /uploads/image-17290123.jpg).
 */
export async function uploadImageFile(file: File): Promise<string> {
  const dataUrl = await optimizeImageIfNeeded(file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataUrl,
        filename: file.name,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.url) {
        return result.url;
      }
    }
    console.warn('[Upload] Server upload returned non-200, fallback to dataUrl');
  } catch (err) {
    console.warn('[Upload] Failed to upload image to server disk, fallback to dataUrl:', err);
  }

  // Fallback to in-memory data URL if network/server is unavailable
  return dataUrl;
}

/**
 * Uploads a base64 dataUrl string to the backend disk.
 */
export async function uploadDataUrl(dataUrl: string, filename = 'image.jpg'): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    return dataUrl;
  }

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataUrl,
        filename,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.url) {
        return result.url;
      }
    }
  } catch (err) {
    console.warn('[Upload] Failed to convert dataUrl to disk URL:', err);
  }

  return dataUrl;
}
