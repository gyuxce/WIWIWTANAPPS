import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "screens/ProfileScreen";

const Home = createStackNavigator();

const ProfileTab = () => {
  return (
    <Home.Navigator>
      <Home.Screen
        options={{ headerShown: false }}
        name="ProfileScreen"
        component={ProfileScreen}
      />
    </Home.Navigator>
  );
};

export default ProfileTab;
