import React from 'react';
import '../styles/Splitter.css';

const Splitter = ({ orientation = 'vertical', isDragging, ...props }) => {
  return <div className={`splitter splitter--${orientation} ${isDragging ? 'splitter--active' : ''}`} {...props} />;
};

export default Splitter;
