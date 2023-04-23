import {memo} from 'react';
import {Chip, Appbar as PaperAppbar, Text} from 'react-native-paper';
import {LinearGradientText} from 'react-native-linear-gradient-text';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {HStack, Stack} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const ModernChip = ({label, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <LinearGradient
        colors={['#1e90ff', '#87CEFA']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.chip]}>
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

interface IAppbarProps {
  onShowFilters: () => void;
  title: string;
  onRefresh: () => void;
}

function Appbar(props: IAppbarProps) {
  const {onShowFilters, title, onRefresh} = props;
  const navigation = useNavigation();

  const onShowInformationView = () => navigation.navigate('About');

  return (
    <Stack>
      <HStack style={styles.header}>
        <LinearGradientText
          // colors={['#1E88E5', '#81D4FA', '#1E88E5', '#81D4FA']}
          colors={['#000000']}
          text={title}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          textStyle={styles.linearGradientTextStyles}
        />

        <HStack>
          <PaperAppbar.Action icon="refresh" size={22} onPress={onRefresh} />
          <PaperAppbar.Action
            onPress={onShowFilters}
            size={22}
            icon="cog-outline"
          />
          <PaperAppbar.Action
            onPress={onShowInformationView}
            size={22}
            icon="information-outline"
          />
        </HStack>
      </HStack>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        <HStack space={2} style={{paddingBottom: 10, paddingHorizontal: 20}}>
          <ModernChip
            label="Topic: Politics"
            onPress={() => navigation.navigate('Settings')}
          />
          <ModernChip
            label="Target Language: Español"
            onPress={() => navigation.navigate('Settings')}
          />
          <ModernChip
            label="Difficulty: C1 (Advanced)"
            onPress={() => navigation.navigate('Settings')}
          />
        </HStack>
      </ScrollView>
    </Stack>
  );
}

const styles = StyleSheet.create({
  linearGradientTextStyles: {
    fontSize: 24.5,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: '600',
  },
  header: {
    paddingLeft: 20,
    margin: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chip: {
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'System', // Change to a custom font if desired
  },
});

export default memo(Appbar);
export {type IAppbarProps};
