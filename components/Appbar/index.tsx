import {memo} from 'react';
import {Appbar as PaperAppbar, Text} from 'react-native-paper';
import {LinearGradientText} from 'react-native-linear-gradient-text';
import {StyleSheet, View} from 'react-native';
import { HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';


interface IAppbarProps {
  onShowFilters: () => void;
  title: string;
  onRefresh: () => void;
}

function Appbar(props: IAppbarProps) {
  const {onShowFilters, title, onRefresh} = props;
  const navigation = useNavigation()

  const onShowInformationView = () => navigation.navigate('About')

  return (
    <HStack style={styles.header}>
   
          <LinearGradientText
            colors={['#1E88E5', '#81D4FA', '#1E88E5', '#81D4FA']}
            text={title}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            textStyle={styles.linearGradientTextStyles}
          />
      

<HStack>
<PaperAppbar.Action icon="refresh" size={22} onPress={onRefresh} />
<PaperAppbar.Action onPress={onShowFilters} size={22} icon="cog-outline" />
<PaperAppbar.Action onPress={onShowInformationView} size={22} icon="information-outline" />


</HStack>

    </HStack>
  );
}

const styles = StyleSheet.create({
  linearGradientTextStyles: {
    fontSize: 27.5,
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
    justifyContent :'space-between',
  },
});

export default memo(Appbar);
export {type IAppbarProps};
