import { Image } from 'expo-image';
import { DimensionValue, ImageStyle } from 'react-native';

interface GreenHillSvgProps {
  width?: DimensionValue;
  height?: DimensionValue;
  style?: ImageStyle;
}

export const GreenHillSvg = ({ width = "100%", height = 305, style }: GreenHillSvgProps) => {
  return (
    <Image
      source={require('@/assets/images/green_hill.svg')}
      style={[{ width, height }, style]}
      contentFit="fill"
    />
  );
};

