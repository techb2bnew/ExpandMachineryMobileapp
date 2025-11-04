import { View, Text } from 'react-native';
import React from 'react';
import AgentHome from '../components/AgentHome';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <AgentHome navigation={navigation} />
    </View>
  );
};

export default HomeScreen;
