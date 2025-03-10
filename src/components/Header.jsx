import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { black, white } from "../constants/color";
import { chatsappBackground } from "../constants/color";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const Header = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.chatappheading}>ChatsApp</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.btn}>
        <AntDesign name="search1" color={white} size={20} />
          {/* <Text>search</Text> */}
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
    // alignContent: "center",
    backgroundColor: chatsappBackground,
    paddingHorizontal: 15,
  },
  chatappheading: {
    color: white,
    fontSize: 22,
    fontWeight: 800,
  },
  iconContainer:{
    color:white,
    flexDirection:"row",
    gap:12
  },
  btn:{
    color:white
  }
});
