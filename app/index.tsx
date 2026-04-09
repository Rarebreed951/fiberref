import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-[#0D0D0D] items-center justify-center">
      <Text className="text-[#00FFFF] text-2xl font-bold">FiberRef</Text>
      <Text className="text-[#A0A0A0] text-base mt-2">
        Fiber optic field reference
      </Text>
    </View>
  );
}
