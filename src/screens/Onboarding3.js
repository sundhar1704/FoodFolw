import React from 'react';
import OnboardingLayout from '../components/OnboardingLayout';

const image = require('../../assets/image/Frame 104.jpg');

export default function Onboarding3({ navigation }) {
  return (
    <OnboardingLayout
      image={image}
      title="Fast Delivery"
      description={'Get your food Deliverd hot and freshto\nyour doorsteps in minits'}
      activeIndex={2}
      navigation={navigation}
      onNext={() => navigation.replace('Login')}
    />
  );
}