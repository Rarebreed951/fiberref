import { View, Text } from "react-native";

interface Props {
  // Bottom safe-area inset passed from AppShell so the ad sits above the iOS
  // home indicator. Defaults to 0 for contexts where insets are unavailable.
  bottomInset?: number;
}

// Placeholder for Google AdMob banner — replace with actual AdMob component
// when integrated. The bottomInset pads the slot above the home indicator.
export default function BannerAdSlot({ bottomInset = 0 }: Props) {
  return (
    <View
      style={{
        height: 50 + bottomInset,
        paddingBottom: bottomInset,
        backgroundColor: "#1A1A1A",
        borderTopWidth: 1,
        borderTopColor: "#2A2A2A",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#444444", fontSize: 11, letterSpacing: 2 }}>
        ADVERTISEMENT
      </Text>
    </View>
  );
}
