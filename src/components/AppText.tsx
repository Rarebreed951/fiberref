import { Text, TextProps } from "react-native";
import { useFontSize } from "../context/FontSizeContext";
import { FontSizes, FontSizeKey, TextColors, TextColorKey } from "../theme";

interface AppTextProps extends TextProps {
  size?:  FontSizeKey;
  color?: TextColorKey | (string & {});
}

export default function AppText({
  size  = "md",
  color = "primary",
  style,
  ...props
}: AppTextProps) {
  const { scale } = useFontSize();
  const fontSize  = FontSizes[size] * scale;
  const textColor = color in TextColors
    ? TextColors[color as TextColorKey]
    : color;

  return (
    <Text
      style={[{ fontSize, color: textColor }, style]}
      {...props}
    />
  );
}
