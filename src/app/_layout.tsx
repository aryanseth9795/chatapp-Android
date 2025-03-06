import { Redirect, Stack } from "expo-router";
import { useState } from "react";

export default function RootLayout() {
  const [isAuth, setIsAuth] = useState(false);

  return isAuth ? <Redirect href="./(main)" /> : <Redirect href={"./(auth)"} />;
}
