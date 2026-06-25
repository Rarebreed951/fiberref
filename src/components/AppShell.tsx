import BannerAdSlot from "./BannerAdSlot";

interface Props {
  children: React.ReactNode;
  showAd?: boolean;
}

export default function AppShell({ children, showAd = true }: Props) {
  return (
    <>
      {children}
      {showAd && <BannerAdSlot />}
    </>
  );
}
