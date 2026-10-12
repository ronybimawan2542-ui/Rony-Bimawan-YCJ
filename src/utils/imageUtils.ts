/**
 * Utilitas untuk membaca dan mengompres foto dari galeri HP / Kamera
 * Mengubah file gambar lokal menjadi Base64 Data URL yang ringan & tajam
 */
export const readFileAsCompressedDataUrl = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File yang dipilih bukan gambar. Silakan pilih foto dari galeri HP.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('Gagal membaca data gambar dari perangkat.'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Skalakan proporsional agar tidak melebihi maxWidth / maxHeight
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Menggunakan JPEG dengan kualitas 0.82 menghasilkan file ~80-180KB yang sangat tajam
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        reject(new Error('Format gambar tidak didukung atau file rusak.'));
      };

      img.src = result;
    };

    reader.onerror = () => {
      reject(new Error('Terjadi kesalahan saat membaca file dari galeri HP.'));
    };

    reader.readAsDataURL(file);
  });
};
