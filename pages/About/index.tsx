import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, StyleSheet} from 'react-native';
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
    display: 'flex',
    backgroundColor: '#FFF',
  },
});

export default About;
