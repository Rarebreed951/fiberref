import { useFontSize } from "../context/FontSizeContext";
import { FontSizes, FontSizeKey, TextColors, TextColorKey } from "../theme";

interface AppTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?:  FontSizeKey;
  color?: TextColorKey | (string & {});
  numberOfLines?: number;
}

export default function AppText({
  size  = "md",
  color = "primary",
  style,
  numberOfLines,
  className = "",
  children,
  ...props
}: AppTextProps) {
  const { scale } = useFontSize();
  const fontSize  = FontSizes[size] * scale;
  const textColor = color in TextColors
    ? TextColors[color as TextColorKey]
    : color;

  const clampClass =
    numberOfLines === 1
      ? "truncate"
      : numberOfLines
      ? `line-clamp-${numberOfLines}`
      : "";

  return (
    <span
      style={{ fontSize, color: textColor, ...(style as React.CSSProperties) }}
      className={`${clampClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
