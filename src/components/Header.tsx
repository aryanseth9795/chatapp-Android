import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { black, white } from "../constants/color";
import { chatsappBackground } from "../constants/color";
import { AntDesign, Entypo } from "@expo/vector-icons";

const Header: React.FC = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.chatappheading}>ChatsApp</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.btn}>
          <AntDesign name="search1" color={white} size={20} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="dots-three-vertical" color={white} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1 / 11,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: chatsappBackground,
    paddingHorizontal: 15,
  },
  chatappheading: {
    color: white,
    fontSize: 22,
    fontWeight: "800",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 12,
  },
  btn: {},
});
