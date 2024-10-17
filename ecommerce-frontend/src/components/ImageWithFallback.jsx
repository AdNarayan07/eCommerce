import React, { useEffect, useState } from "react";

const ImageWithFallback = ({ src, alt, fallbackSrc, className = "", prefixAPI_URL = true }) => {
  const API_URL = import.meta.env.VITE_API_URL + "/images/";

  const [imgSrc, setImgSrc] = useState((prefixAPI_URL ? API_URL : "") + src);
  useEffect(() => {
    setImgSrc((prefixAPI_URL ? API_URL : "") + src);
  }, [src]);

  const handleError = () => {
    setImgSrc(fallbackSrc); // Set the fallback image if the primary fails to load
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError} // Trigger handleError if img fails to load
      className={className} // Example styling
    />
  );
};

export default ImageWithFallback;
