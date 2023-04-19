import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const LoadingDots: React.FC = () => {
  const dotSize = 10;
  const dotMargin = 5;
  const dotAnimationDuration = 400;
  const dotAnimationDelay = 200;

  const dot1Animation = React.useRef(new Animated.Value(0)).current;
  const dot2Animation = React.useRef(new Animated.Value(0)).current;
  const dot3Animation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const runAnimation = () => {
      Animated.sequence([
        Animated.timing(dot1Animation, {
          toValue: 1,
          duration: dotAnimationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Animation, {
          toValue: 1,
          duration: dotAnimationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Animation, {
          toValue: 1,
          duration: dotAnimationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(dot1Animation, {
          toValue: 0,
          duration: dotAnimationDuration,
          delay: dotAnimationDelay,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Animation, {
          toValue: 0,
          duration: dotAnimationDuration,
          delay: dotAnimationDelay,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Animation, {
          toValue: 0,
          duration: dotAnimationDuration,
          delay: dotAnimationDelay,
          useNativeDriver: true,
        }),
      ]).start(() => {
        runAnimation();
      });
    };

    runAnimation();
  }, [dot1Animation, dot2Animation, dot3Animation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.dot,
          {
            marginRight: dotMargin,
            backgroundColor: '#42A5F5',
            transform: [
              {
                translateY: dot1Animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -dotSize * 2],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            marginRight: dotMargin,
            backgroundColor: '#81D4FA',
            opacity: dot2Animation,
            transform: [
              {
                translateY: dot2Animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -dotSize],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: '#BBDEFB',
            opacity: dot3Animation,
            transform: [
              {
                translateY: dot3Animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -dotSize * 2],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default LoadingDots;
