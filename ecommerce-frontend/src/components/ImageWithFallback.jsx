import React, { useEffect, useState } from "react";

const ImageWithFallback = ({ src, alt, fallbackSrc, className = "" }) => {
  const [imgSrc, setImgSrc] = useState(src);
  useEffect(() => {
    setImgSrc(src);
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
