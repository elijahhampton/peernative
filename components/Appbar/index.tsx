import {memo} from 'react';
import {Appbar as PaperAppbar, Text} from 'react-native-paper';
import {LinearGradientText} from 'react-native-linear-gradient-text';
import {StyleSheet, View} from 'react-native';


interface IAppbarProps {
  onShowFilters: () => void;
  title: string;
  onRefresh: () => void;
}

function Appbar(props: IAppbarProps) {
  const {onShowFilters, title, onRefresh} = props;

  return (
    <PaperAppbar.Header style={styles.header}>
      <PaperAppbar.Action onPress={onShowFilters} icon="filter-variant" />
      <PaperAppbar.Content
        title={
          <LinearGradientText
            colors={['#1E88E5', '#81D4FA', '#1E88E5', '#81D4FA']}
            text={title}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            textStyle={styles.linearGradientTextStyles}
          />
        }
      />

      <PaperAppbar.Action icon="refresh" onPress={onRefresh} />
    </PaperAppbar.Header>
  );
}

const styles = StyleSheet.create({
  linearGradientTextStyles: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
   //fontWeight: '200',
  },
  header: {
    backgroundColor: 'rgb(248, 250 253)'
  },
});

export default memo(Appbar);
export {type IAppbarProps};
