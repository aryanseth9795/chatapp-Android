import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Store";

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
