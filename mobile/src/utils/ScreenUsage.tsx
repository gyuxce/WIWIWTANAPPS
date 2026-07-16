import { useAuth } from "hooks/useAuth";
import React, { useEffect } from "react";
import { AppState, View } from "react-native";
import { apiScreenUsage } from "services/ExamServices";

const ScreenUsage = () => {
  const { auth } = useAuth();
  let intervalId: any = null;
  let t = 1;

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (nextAppState === "background") {
        if (auth?.accessToken) {
          apiScreenUsage(auth?.accessToken, t).then(() => {
            clearInterval(intervalId);
            intervalId = null;
            t = 1;
          });
        }
      } else if (nextAppState === "active") {
        if (intervalId === null) {
          intervalId = setInterval(() => {
            t++;
          }, 1000);
        }
      }
    });

    return () => {
      subscription.remove();
      clearInterval(intervalId);
    };
  }, []);
  return <View />;
};

export default ScreenUsage;
