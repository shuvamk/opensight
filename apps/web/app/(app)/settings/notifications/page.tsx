"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "@/hooks/useNotifications";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const notificationsSettingsSchema = z.object({
  visibilityDrop: z.boolean(),
  newMention: z.boolean(),
  sentimentShift: z.boolean(),
  newCompetitor: z.boolean(),
  emailFrequency: z.enum(["daily", "weekly", "none"]),
  webhookUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

type NotificationsSettingsInputs = z.infer<typeof notificationsSettingsSchema>;

export default function NotificationsSettingsPage() {
  const [isSaved, setIsSaved] = useState(false);

  const { data: settings, isLoading } = useNotificationSettings();
  const { mutate: updateSettings, isPending } = useUpdateNotificationSettings();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<NotificationsSettingsInputs>({
    resolver: zodResolver(notificationsSettingsSchema),
    values: settings
      ? {
          visibilityDrop: settings.alertVisibilityDrop ?? true,
          newMention: settings.alertNewMention ?? true,
          sentimentShift: settings.alertSentimentShift ?? true,
          newCompetitor: settings.alertCompetitorNew ?? true,
          emailFrequency: (settings.emailFrequency as "daily" | "weekly" | "none") ?? "daily",
          webhookUrl: settings.webhookUrl || "",
        }
      : {
          visibilityDrop: true,
          newMention: true,
          sentimentShift: true,
          newCompetitor: true,
          emailFrequency: "daily",
          webhookUrl: "",
        },
  });

  const emailFrequency = watch("emailFrequency");

  const handleSubmitSuccess = () => {
    toast.success("Notification settings updated!");
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const onSubmit = (data: NotificationsSettingsInputs) => {
    updateSettings(
      {
        email_frequency: data.emailFrequency,
        alert_visibility_drop: data.visibilityDrop,
        alert_new_mention: data.newMention,
        alert_sentiment_shift: data.sentimentShift,
        alert_competitor_new: data.newCompetitor,
        webhook_url: data.webhookUrl || null,
      },
      {
        onSuccess: handleSubmitSuccess,
        onError: (e) =>
          toast.error(
            e instanceof Error ? e.message : "Failed to update settings"
          ),
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings</p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div>
            <Card className="p-4">
              <SettingsSidebar />
            </Card>
          </div>

          {/* Content */}
          <div className="md:col-span-3 space-y-6">
            {isLoading ? (
              <Card className="p-8 text-center text-gray-600">
                Loading notification settings...
              </Card>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold">Notifications</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Configure how you receive alerts and updates
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Alert Types */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Alert Types</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="visibilityDrop"
                          {...register("visibilityDrop")}
                        />
                        <Label
                          htmlFor="visibilityDrop"
                          className="font-normal cursor-pointer"
                        >
                          Visibility Drop
                          <p className="text-sm text-gray-600">
                            Get notified when your page visibility decreases
                          </p>
                        </Label>
                      </div>

                      <Separator />

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="newMention"
                          {...register("newMention")}
                        />
                        <Label
                          htmlFor="newMention"
                          className="font-normal cursor-pointer"
                        >
                          New Mention
                          <p className="text-sm text-gray-600">
                            Get notified when your content is mentioned
                          </p>
                        </Label>
                      </div>

                      <Separator />

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sentimentShift"
                          {...register("sentimentShift")}
                        />
                        <Label
                          htmlFor="sentimentShift"
                          className="font-normal cursor-pointer"
                        >
                          Sentiment Shift
                          <p className="text-sm text-gray-600">
                            Get notified when sentiment analysis changes significantly
                          </p>
                        </Label>
                      </div>

                      <Separator />

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="newCompetitor"
                          {...register("newCompetitor")}
                        />
                        <Label
                          htmlFor="newCompetitor"
                          className="font-normal cursor-pointer"
                        >
                          New Competitor
                          <p className="text-sm text-gray-600">
                            Get notified when new competitors are detected
                          </p>
                        </Label>
                      </div>
                    </div>
                  </Card>

                  {/* Email Frequency */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Email Frequency</h3>
                    <Select
                      value={emailFrequency}
                      onValueChange={(value) =>
                        setValue("emailFrequency", value as "daily" | "weekly" | "none")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="none">No Email Digest</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-600 mt-2">
                      Choose how often you want to receive email notifications
                    </p>
                  </Card>

                  {/* Webhook */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Webhook</h3>
                    <div>
                      <Label htmlFor="webhookUrl">Webhook URL</Label>
                      <Input
                        id="webhookUrl"
                        type="url"
                        placeholder="https://example.com/webhook"
                        {...register("webhookUrl")}
                      />
                      {errors.webhookUrl && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.webhookUrl.message}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-2">
                        Receive real-time notifications via webhook
                      </p>
                    </div>
                  </Card>

                  {/* Save Button */}
                  <div className="flex justify-end gap-3">
                    {isSaved && (
                      <p className="text-sm text-green-600 mr-auto flex items-center gap-2">
                        ✓ Settings saved
                      </p>
                    )}
                    <Button
                      type="submit"
                      disabled={isPending}
                    >
                      {isPending && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Save Settings
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
