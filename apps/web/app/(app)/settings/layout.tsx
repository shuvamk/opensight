import { SettingsTabs } from "@/components/settings/SettingsTabs";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
        <SettingsTabs />
        <div className="mt-6">{children}</div>
    </div>
  );
}
