import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TrainingScreen from "screens/TrainingScreen";

const Home = createStackNavigator();

const TrainingTab = () => {
  return (
    <Home.Navigator>
      <Home.Screen
        options={{ headerShown: false }}
        name="TrainingScreen"
        component={TrainingScreen}
      />
    </Home.Navigator>
  );
};

export default TrainingTab;
