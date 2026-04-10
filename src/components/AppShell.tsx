import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BannerAdSlot from "./BannerAdSlot";

interface Props {
  children: React.ReactNode;
  showAd?: boolean;
}

// Wraps every screen. Handles the iOS home-indicator inset at the bottom so
// content and the ad slot are never obscured. showAd defaults to true; pass
// false for the Calculator and Search screens (UX Rule 7).
export default function AppShell({ children, showAd = true }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#0D0D0D" }}>
      <View style={{ flex: 1 }}>{children}</View>
      {showAd ? (
        <BannerAdSlot bottomInset={insets.bottom} />
      ) : (
        // Reserve space for the home indicator even without an ad.
        <View style={{ height: insets.bottom }} />
      )}
    </View>
  );
}
