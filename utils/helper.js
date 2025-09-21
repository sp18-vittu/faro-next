export const fileFormats = {
  image: { formats: ["png", "jpg", "jpeg", "gif", "svg"], icon: null },
  audio: { formats: ["mp3", "wav", "m4a"], icon: "audiotrack" },
  video: { formats: ["webm", "mp4"], icon: "ondemand_video" },
  threeDimensional: { formats: ["glb"], icon: "3d_rotation" },
};

export const getFileFormat = (file) => {
  return file.substring(file.lastIndexOf(".") + 1, file.length);
};

export const getFileTypes = (format) => {
  if (fileFormats.audio.formats.includes(format)) {
    return { type: "audio", icon: fileFormats.audio.icon };
  } else if (fileFormats.video.formats.includes(format)) {
    return { type: "video", icon: fileFormats.video.icon };
  } else if (fileFormats.threeDimensional.formats.includes(format)) {
    return {
      type: "threeDimensional",
      icon: fileFormats.threeDimensional.icon,
    };
  } else {
    return {};
  }
};

export const getMobileOperatingSystem = () => {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPhone/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }

  return "unknown";
};

export const getCategoryId = (categories, categoryId) => {
  let primaryCategoryId = null,
    name = "";
  for (const category of categories) {
    if (category.id === categoryId) {
      primaryCategoryId = category.id;
      name = category.name;
      break;
    }
  }
  if (!primaryCategoryId) {
    for (const category of categories) {
      for (const subCategory of category.subCategories) {
        if (subCategory.id === categoryId) {
          primaryCategoryId = subCategory.parentCategoryId;
          name = category.name;
          break;
        }
      }
    }
  }
  return { primaryCategoryId, name };
};
