import { Redirect, Stack } from "expo-router";
import { useState } from "react";
import { Provider } from "react-redux";
import Store from "../Redux/Store";

export default function RootLayout() {
  const [isAuth, setIsAuth] = useState(true);


  

  return (
    <>
      <Provider store={Store}>
        <Stack screenOptions={{ headerShown: false }} />
        {isAuth ? <Redirect href="/(main)" /> : <Redirect href={"/(auth)"} />}
      </Provider>
    </>
  );
}
