import React from 'react';
import OnboardingLayout from '../components/OnboardingLayout';

const image = require('../../assets/image/Frame 100.jpg');

export default function Onboarding1({ navigation }) {
  return (
    <OnboardingLayout
      image={image}
      title="Discover Restaurants"
      description={'Find Your favorite local restaurant an explore\ncuisines from the comfort of\nyour home'}
      activeIndex={0}
      navigation={navigation}
      onNext={() => navigation.navigate('Onboarding2')}
    />
  );
}