import React from 'react';
import LeftSection from './LeftSection';
import RightSection from './RightSection';

export default function LoginPage() {
  return (
    <div className="flex h-screen">
      <LeftSection />
      <RightSection />
    </div>
  );
}