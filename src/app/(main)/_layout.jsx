import { StyleSheet, Text, View, SafeAreaView, StatusBar } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { white } from "../../constants/color";
import Home from "./screens/Home";
import Status from "./screens/Status";
import Groups from "./screens/Groups";
import Profile from "./screens/Profile";
import Header from "../../components/Header";
import { chatsappBackground } from "../../constants/color";
import Fontisto from "react-native-vector-icons/Fontisto";
import serverUrl from "../../constants/config";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const MainStack_Layout = () => {
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();
  const {user}=useSelector((state)=>state.Auth);
  const fetchfunc = async () => {
    try {
      const userdetail = await axios.get(`${serverUrl}/users/me`, {
        withCredentials: true,
      });
      console.log(userdetail?.data?.user)
      dispatch(userexist(userdetail?.data?.user));
      dispatch(setNotificationCount(userdetail?.data?.user?.notificationCount));
    } catch (error) {
      dispatch(userNotexist());
    }
  };

  // Auto Reloading
  useEffect(() => {
    if (!user?.name) {
      fetchfunc();
    }
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={chatsappBackground}
        barStyle={"light-content"}
      />
      <Header />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: "#121212", height: 60 },
          tabBarActiveTintColor: "#1DB954",
          tabBarInactiveTintColor: "#aaa",
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="home" color={white} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Status"
          component={Status}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="circle-o-notch" color={white} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Groups"
          component={Groups}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="group" color={white} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Fontisto name="person" color={white} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default MainStack_Layout;

const styles = StyleSheet.create({});
