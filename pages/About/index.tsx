import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, StyleSheet, View, Text, Image} from 'react-native';
import {Appbar, Button} from 'react-native-paper';

function About() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Appbar style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="About"
          titleStyle={styles.title}
          style={styles.content}
        />
      </Appbar>
      <View style={styles.contentContainer}>
        <Text
          style={{
            fontSize: 12,
            color: '#757575',
            fontStyle: 'italic',
            letterSpacing: 0.5,
            lineHeight: 16,
            padding: 20,
            textAlign: 'center',
            textAlignVertical: 'center',
          }}>
          Peer Native works in a similar way to other messaging applications in
          the way you can chat with the AI as you talk with your friends.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    alignSelf: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: '800',
  },
  header: {
    backgroundColor: '#FFF',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default About;
