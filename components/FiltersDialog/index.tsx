import React, {useState} from 'react';
import {Dialog, Button} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {Stack, HStack} from 'native-base';
import DropDown from 'react-native-paper-dropdown';
import {LANGUAGES, LANGUAGE_LEVELS, TOPICS} from '../../constants/filters';

interface IFilterState {
  desired_training_level: string;
  language: string;
  topic: string;
  target_language: string;
}

interface IFiltersDialogProps {
  filters: IFilterState;
  visible: boolean;
  onSave: () => void;
  onDismiss: () => void;
  setFilters: (
    params: any,
  ) => React.Dispatch<React.SetStateAction<IFilterState>>;
}

function FiltersDialog(props: IFiltersDialogProps) {
  const {filters, setFilters, visible, onDismiss, onSave} = props;

  const [dropdownVisibilities, setDropdownVisibilities] = useState({
    desired_training_level: false,
    language: false,
    target_language: false,
    topic: false,
  });

  return (
    <Dialog style={{borderRadius: 11}} visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>Session Customization</Dialog.Title>
      <Dialog.Content>
        <Stack space={3}>
          <DropDown
            label={'Topic'}
            mode={'outlined'}
            visible={dropdownVisibilities['topic']}
            showDropDown={() => {
              setDropdownVisibilities({
                ...dropdownVisibilities,
                topic: true,
              });
            }}
            onDismiss={() => {
              setDropdownVisibilities({
                ...dropdownVisibilities,
                topic: false,
              });
            }}
            value={filters['topic']}
            setValue={value => {
              setFilters({
                ...filters,
                topic: value,
              });
            }}
            list={TOPICS}
          />

          <DropDown
            label={'Training Target'}
            mode={'outlined'}
            visible={dropdownVisibilities['desired_training_level']}
            showDropDown={() =>
              setDropdownVisibilities({
                ...dropdownVisibilities,
                desired_training_level: true,
              })
            }
            onDismiss={() =>
              setDropdownVisibilities({
                ...dropdownVisibilities,
                desired_training_level: false,
              })
            }
            value={filters['desired_training_level']}
            setValue={value =>
              setFilters({
                ...filters,
                desired_training_level: value,
              })
            }
            list={LANGUAGE_LEVELS}
          />

          <DropDown
            label={'Language'}
            mode={'outlined'}
            visible={dropdownVisibilities['language']}
            showDropDown={() =>
              setDropdownVisibilities({
                ...dropdownVisibilities,
                language: true,
              })
            }
            onDismiss={() =>
              setDropdownVisibilities({
                ...dropdownVisibilities,
                language: false,
              })
            }
            value={filters['language']}
            setValue={value =>
              setFilters({
                ...filters,
                language: value,
              })
            }
            list={LANGUAGES}
          />

          <DropDown
            label={'Target Language'}
            mode={'outlined'}
            visible={dropdownVisibilities['target_language']}
            showDropDown={() =>
              setDropdownVisibilities({
                ...dropdownVisibilities,
                target_language: true,
              })
            }
            onDismiss={() =>
              setDropdownVisibilities({
                ...dropdownVisibilities,
                target_language: false,
              })
            }
            value={filters['target_language']}
            setValue={value =>
              setFilters({
                ...filters,
                target_language: value,
              })
            }
            list={LANGUAGES}
          />
        </Stack>
      </Dialog.Content>
      <Dialog.Actions>
        <Button textColor="#42A5F5" onPress={onDismiss}>
          Cancel
        </Button>
        <Button
          onPress={onSave}
          compact
          style={{borderRadius: 2, backgroundColor: '#42A5F5'}}
          mode="contained">
          Save
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  sessionStarted: {
    flex: 1,
    backgroundColor: 'rgb(248, 250 253)',
  },
  sessionAwaiting: {
    flex: 1,
    backgroundColor: 'rgb(248, 250 253)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FiltersDialog