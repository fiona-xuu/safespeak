import { Button, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>SafeSpeak 🛡️</Text>
      <Text>Voice-Activated Safety Companion</Text>
      <Button title="Record" onPress={() => alert("Recording soon")} />
    </View>
  );
}