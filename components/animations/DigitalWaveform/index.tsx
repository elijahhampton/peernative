import React, {useEffect} from 'react';
import {Dimensions} from 'react-native';
import {Line, Svg} from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const {width} = Dimensions.get('window');
const AnimatedLine = Animated.createAnimatedComponent(Line);

const numberOfLines = 20;
const duration = 2000;
const amplitude = 50;
const centerY = amplitude;

const WaveLine = ({index}) => {
  const phaseShift = useSharedValue(0);

  useEffect(() => {
    phaseShift.value = withRepeat(
      withTiming(2 * Math.PI, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      true,
    );
  }, [phaseShift]);

  const animatedProps = useAnimatedProps(() => {
    const x = (index * width) / numberOfLines;
    const y1 = centerY + amplitude * Math.sin(x + phaseShift.value);
    const y2 = centerY - amplitude * Math.sin(x + phaseShift.value);

    return {
      x1: x,
      y1,
      x2: x,
      y2,
    };
  }, []);

  return (
    <AnimatedLine
      animatedProps={animatedProps}
      stroke="#B3E5FC"
      strokeWidth={2}
    />
  );
};

const WaveAnimation = () => {
  return (
    <Svg width={width} height={2 * amplitude}>
      {Array.from({length: numberOfLines}, (_, i) => (
        <WaveLine key={i} index={i} />
      ))}
    </Svg>
  );
};

export default WaveAnimation;
