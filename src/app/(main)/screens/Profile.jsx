import { StyleSheet, Text, View } from 'react-native'
import React ,{useState}from 'react';
import { useSelector } from "react-redux";

const Profile = () => {

  const { user } = useSelector((state) => state.Auth);
  const [isEdit, setIsEdit] = useState(false);
  return (
    <View>
      <Text>Profile</Text>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})



// import {
//   CalendarMonth,
//   Face as FaceIcon,
//   AlternateEmail as UsernameIcon,
// } from "@mui/icons-material";
// import EditIcon from "@mui/icons-material/Edit";
// import InfoIcon from "@mui/icons-material/Info";
// import {
//   Avatar,
//   Backdrop,
//   IconButton,
//   Stack,
//   Typography
// } from "@mui/material";
// import moment from "moment";
// import React, { lazy, Suspense, useState } from "react";
// import { useSelector } from "react-redux";

// const EditProfile = lazy(() => import("./EditProfile"));
// const Profile = () => {
//   const { user } = useSelector((state) => state.Auth);
//   const [isEdit, setIsEdit] = useState(false);

//   return (
//     <Stack spacing={"2rem"} alignItems={"center"}>
//       <Avatar
//         src={user.avatar?.url}
//         sx={{
//           height: "10rem",
//           width: "10rem",
//           objectFit: "contain",
//           marginBottom: "1rem",
//           border: "5px solid white",
//         }}
//       />

//       <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon />} />

//       <ProfileCard
//         heading={"Username"}
//         text={user.username}
//         Icon={<UsernameIcon />}
//       />

//       <ProfileCard
//         heading={"Bio"}
//         text={user?.bio ? user?.bio : "Like to add Something about yourself ? "}
//         Icon={<InfoIcon />}
//       />
//       <ProfileCard
//         heading={"Joined"}
//         text={moment(user.createdAt).fromNow()}
//         Icon={<CalendarMonth />}
//       />

//       <IconButton color="primary" onClick={() => setIsEdit(true)}>
//         <EditIcon />
//         <Typography padding={"1rem"} variant="caption">
//           Edit Profile
//         </Typography>
//       </IconButton>
//       {isEdit && (
//         <Suspense fallback={<Backdrop open={true} />}>
//           <EditProfile isEdit={isEdit} setIsEdit={setIsEdit} />
//         </Suspense>
//       )}
//     </Stack>
//   );
// };

// const ProfileCard = ({ text, Icon, heading }) => (
//   <Stack
//     direction={"row"}
//     alignItems={"center"}
//     spacing={"1rem"}
//     color={"white"}
//     textAlign={"center"}
//   >
//     {Icon && Icon}
//     <Stack>
//       <Typography variant="body2">{text}</Typography>
//       <Typography color={"grey"} variant="caption">
//         {heading}
//       </Typography>
//     </Stack>
//   </Stack>
// );

// export default Profile;