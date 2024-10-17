import React, { useEffect, useState } from "react";

const ImageWithFallback = ({ src, alt, fallbackSrc, className = "", prefixAPI_URL = true }) => {
  const API_URL = import.meta.env.VITE_API_URL + "/images/"; // Get base API URL for images

  // Initialize image source, optionally prefixing with API URL
  const [imgSrc, setImgSrc] = useState((prefixAPI_URL ? API_URL : "") + src);
  
  // Update image source when 'src' changes
  useEffect(() => {
    setImgSrc((prefixAPI_URL ? API_URL : "") + src);
  }, [src]);

  // Set fallback image if primary image fails to load
  const handleError = () => {
    setImgSrc(fallbackSrc);
  };

  return (
    <img
      src={imgSrc} // Use the current image source
      alt={alt} // Alt text for accessibility
      onError={handleError} // Handle error by switching to fallback image
      className={className} // Optional CSS class for styling
    />
  );
};

export default ImageWithFallback;
