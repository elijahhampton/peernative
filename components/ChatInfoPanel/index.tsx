import { HStack } from 'native-base';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Divider } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IFilterState {
  desired_training_level: string;
  language: string;
  topic: string;
  target_language: string;
}


interface IChatInfoPanelProps {
  filters: IFilterState;
}

const ChatInfoPanel: React.FC = (props: IChatInfoPanelProps) => {
  const { filters } = props
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleCollapse} style={styles.header}>
        <HStack space={2} style={styles.titleContainer}>
        { isCollapsed ? <Ionicons name="arrow-down-circle-outline" size={18} color="#fff" /> : <Ionicons name="arrow-up-circle-outline" size={18} color="#fff" />}  
          <Text style={styles.headerText}>Show current settings</Text>
        </HStack>
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.content}>
        <View style={styles.parameterContainer}>
            <Text style={styles.parameterTitle}>Native Language:</Text>
            <Text style={styles.parameterValue}>{filters['language']}</Text>
          </View>
          <View style={styles.parameterContainer}>
            <Text style={styles.parameterTitle}>Target Language:</Text>
            <Text style={styles.parameterValue}>{filters['target_language']}</Text>
          </View>
          <View style={styles.parameterContainer}>
            <Text style={styles.parameterTitle}>Topic:</Text>
            <Text style={styles.parameterValue}>{filters['topic']}</Text>
          </View>
          <View style={styles.parameterContainer}>
            <Text style={styles.parameterTitle}>Level:</Text>
            <Text style={styles.parameterValue}>{filters['desired_training_level']}</Text>
          </View>
          {/* Add more parameters if needed */}
        </View>
      </Collapsible>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
    parameterValue: {
        fontSize: 14,
        color: '#333',
      },
    parameterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      parameterTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginRight: 10,
        textAlign: 'right',
      },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
  container: {
    backgroundColor: '#F5F5F5',
 //   borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 2,
  },
  header: {
    backgroundColor: '#42A5F5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
  },
  contentText: {
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
  },
});

export default ChatInfoPanel;
