// src/components/common/DynamicIcon.jsx
import React from 'react';
import * as HiIcons from 'react-icons/hi';

function DynamicIcon({ name, className }) {
  const IconComponent = HiIcons[name];

  if (!IconComponent) {
    return <HiIcons.HiQuestionMarkCircle className={className} />;
  }

  return <IconComponent className={className} />;
}

export default DynamicIcon;