import { memo } from 'react'
import {
  Button,
  MD3Colors,
  MD3LightTheme as DefaultTheme,
  Divider,
  Provider as PaperProvider,
  Appbar as PaperAppbar,
  IconButton,
  Portal,
  Dialog,
  Surface,
  Text,
  TouchableRipple,
  TextInput,
  Avatar,
} from 'react-native-paper';
import {LinearGradientText} from 'react-native-linear-gradient-text';

interface IAppbarProps {
  onShowFilters: () => void;
  title: string;
  onRefresh: () => void;
}

function Appbar(props: IAppbarProps) {
  const {onShowFilters, title, onRefresh} = props;

  return (
    <PaperAppbar.Header style={{backgroundColor: 'rgb(248, 250 253)'}}>
      <PaperAppbar.Action onPress={onShowFilters} icon="filter-variant" />
      <PaperAppbar.Content
        title={
          <LinearGradientText
            colors={['#1E88E5', '#81D4FA', '#1E88E5']}
            text={title}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            textStyle={{fontSize: 20, paddingTop: 10, paddingBottom: 10}}
          />
        }
      />

      <PaperAppbar.Action icon="refresh" onPress={onRefresh} />
    </PaperAppbar.Header>
  );
}

export default memo(Appbar);
export {type IAppbarProps};
