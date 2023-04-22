import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const languages = [
  'English',
  'Español',
  '中文',
  'Français',
  'Deutsch',
  'Русский',
  '日本語',
];

const colors = ['#42A5F5', '#81D4FA', '#fafafa'];

const Typewriter: React.FC<{ text: string; onCompleted: () => void }> = ({ text, onCompleted }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayText((prevDisplayText) => prevDisplayText.slice(0, -1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          onCompleted();
        }
      } else {
        setDisplayText(text.slice(0, displayText.length + 1));
        if (displayText.length === text.length) {
          setIsDeleting(true);
        }
      }
    }, isDeleting ? 150 : (displayText.length === text.length ? 1500 : 100));
    return () => clearTimeout(timeout);
  }, [isDeleting, displayText, text, onCompleted]);

  return <Text>{displayText}</Text>;
};

const RotatingLanguages: React.FC = () => {
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const colorIndex = useSharedValue(0);

  const changeLanguage = () => {
    setCurrentLanguageIndex((prevIndex) => (prevIndex + 1 === languages.length ? 0 : prevIndex + 1));
    colorIndex.value = colorIndex.value + 1 === colors.length ? 0 : colorIndex.value + 1;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      color: colors[colorIndex.value],
    };
  }, [colors[colorIndex.value]]);

  return (
    <Text style={styles.text}>
      The AI platform helping you learn{' '}
      <Animated.Text style={animatedStyle}>
        <Typewriter text={languages[currentLanguageIndex]} onCompleted={changeLanguage} />
      </Animated.Text>
      .
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RotatingLanguages;
