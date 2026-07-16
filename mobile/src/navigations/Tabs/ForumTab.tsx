import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ForumScreen from "screens/ForumScreen/ForumScreen";

const Forum = createStackNavigator();

const ForumTab = () => {
  return (
    <Forum.Navigator>
      <Forum.Screen
        options={{ headerShown: false }}
        name="ForumScreen"
        component={ForumScreen}
      />
    </Forum.Navigator>
  );
};

export default ForumTab;
