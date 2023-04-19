import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const PeerNativeInfoScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Peer Native!</Text>

      <Text style={styles.description}>
        Peer Native is very similar to WhatsApp in the way that you can chat with the AI as you
        talk with your friends.
      </Text>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Start chatting now and experience the future!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#42A5F5',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#81D4FA',
  },
});

export default PeerNativeInfoScreen;