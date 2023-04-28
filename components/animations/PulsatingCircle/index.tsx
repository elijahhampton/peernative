import React from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const colors = ['#42A5F5', '#81D4FA', '#fafafa'];
const createAnimatedCircleStyle = (
  baseScale: number,
  duration: number,
  delay: number,
) => {
  const scale = useSharedValue(baseScale);

  React.useEffect(() => {
    scale.value = withRepeat(
      withTiming(baseScale === 1 ? 0.8 : 1, {duration, delay}),
      -1,
      true,
    );
  }, []);

  return useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  }, [scale.value]);
};

const PulsatingCircle: React.FC = () => {
  const circle1Style = createAnimatedCircleStyle(1, 1000, 0);
  const circle2Style = createAnimatedCircleStyle(0.8, 1200, 200);
  const circle3Style = createAnimatedCircleStyle(0.6, 1400, 400);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, styles.circle1, circle1Style]} />
      <Animated.View style={[styles.circle, styles.circle2, circle2Style]} />
      <Animated.View style={[styles.circle, styles.circle3, circle3Style]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  circle: {
    position: 'absolute',
    borderRadius: 50,
  },
  circle1: {
    width: 100,
    height: 100,
    backgroundColor: colors[0],
  },
  circle2: {
    width: 80,
    height: 80,
    backgroundColor: colors[1],
  },
  circle3: {
    width: 60,
    height: 60,
    backgroundColor: colors[2],
  },
});

export default PulsatingCircle;
