import React from 'react';
import OnboardingLayout from '../components/OnboardingLayout';

const image = require('../../assets/image/Frame 103.jpg');

export default function Onboarding2({ navigation }) {
  return (
    <OnboardingLayout
      image={image}
      title="Fresh &Quality Foods"
      description={'Every Dish prepared with care and professional\nchef using the finest ingredients'}
      activeIndex={1}
      navigation={navigation}
      onNext={() => navigation.navigate('Onboarding3')}
    />
  );
}