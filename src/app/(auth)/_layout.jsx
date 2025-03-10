import { SafeAreaView, StyleSheet, Text, View, } from "react-native";
import React from "react";
import {Stack} from 'expo-router'
const _layout = () => {
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack />
      </SafeAreaView>
    </>
  );
};

export default _layout;

const styles = StyleSheet.create({});
