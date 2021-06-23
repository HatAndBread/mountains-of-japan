import React, { useState } from 'react';

const Image = ({
  src,
  alt,
  onLoadFail,
  onClick,
  pointer,
}: {
  src: string;
  alt: string;
  pointer?: boolean;
  onLoadFail?: () => void;
  onClick?: () => void;
}) => {
  const [hasError, setHasError] = useState(false);
  return (
    <>
      {hasError ? (
        { alt }
      ) : (
        <img
          style={pointer ? { cursor: 'pointer' } : {}}
          className='Image'
          src={src}
          alt={alt}
          onClick={() => {
            onClick && onClick();
          }}
          onError={() => {
            setHasError(true);
            onLoadFail && onLoadFail();
          }}
        />
      )}
    </>
  );
};

export default Image;
