/**
 * Helper to read and compress image files from client device to a clean Base64 data URL
 * @param {File} file 
 * @param {number} maxWidth 
 * @param {number} maxHeight 
 * @param {number} quality 
 * @returns {Promise<string>} Base64 Data URL
 */
export const processImageFile = (file, maxWidth = 500, maxHeight = 500, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('Aucun fichier sélectionné.'));
    }

    if (!file.type.startsWith('image/')) {
      return reject(new Error('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format d’image invalide.'));
      img.onload = () => {
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
};
