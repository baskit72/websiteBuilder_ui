// ResizableImage.js
import React from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

const ResizableImage = ({ src, alt }) => {
  return (
    <Resizable
      width={100}
      height={100}
      minConstraints={[50, 50]} // Minimum width and height
      maxConstraints={[300, 300]} // Maximum width and height
      onResizeStop={(e, data) => {
        // Handle resizing logic here if needed
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block', // Ensure it doesn't have unwanted inline space
        }}
      />
    </Resizable>
  );
};

export default ResizableImage;
