"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

const apiKeyFormSchema = z.object({
  name: z.string().min(1, "API key name is required").max(100),
});

type ApiKeyFormInputs = z.infer<typeof apiKeyFormSchema>;

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  requestsToday: number;
  requestsThisMonth: number;
  lastUsedAt?: string;
  createdAt: string;
}

interface NewApiKeyResponse {
  id: string;
  name: string;
  key: string;
}

interface RateLimitInfo {
  requestsToday: number;
  requestsThisMonth: number;
  dailyLimit: number;
  monthlyLimit: number;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ApiKeysPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [newKey, setNewKey] = useState<NewApiKeyResponse | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApiKeyFormInputs>({
    resolver: zodResolver(apiKeyFormSchema),
  });

  // Fetch API keys
  const { data: apiKeys = [], isLoading } = useQuery<ApiKey[]>({
    queryKey: ["apiKeys"],
    queryFn: () => apiClient.get("/api/api-keys"),
  });

  // Fetch rate limit info
  const { data: rateLimitInfo } = useQuery<RateLimitInfo>({
    queryKey: ["rateLimitInfo"],
    queryFn: () => apiClient.get("/api/api-keys/rate-limit"),
  });

  // Create API key mutation
  const { mutate: createApiKey, isPending: isCreating } = useMutation({
    mutationFn: (data: ApiKeyFormInputs) =>
      apiClient.post<NewApiKeyResponse>("/api/api-keys", data),
    onSuccess: (data) => {
      setNewKey(data);
      reset();
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
      toast.success("API key created successfully!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create API key"
      );
    },
  });

  // Delete API key mutation
  const { mutate: deleteApiKey } = useMutation({
    mutationFn: (keyId: string) =>
      apiClient.del(`/api/api-keys/${keyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
      toast.success("API key deleted successfully!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete API key"
      );
    },
  });

  const onSubmit = (data: ApiKeyFormInputs) => {
    createApiKey(data);
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(keyId);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setNewKey(null);
      reset();
    }
    setShowDialog(open);
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
            {/* Header with Button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">API Keys</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Create and manage API keys for programmatic access
                </p>
              </div>
              <Button onClick={() => setShowDialog(true)}>
                Create API Key
              </Button>
            </div>

            {/* Rate Limit Info */}
            {rateLimitInfo && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Rate Limits</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Daily Requests</p>
                    <p className="text-2xl font-bold">
                      {rateLimitInfo.requestsToday} / {rateLimitInfo.dailyLimit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Requests</p>
                    <p className="text-2xl font-bold">
                      {rateLimitInfo.requestsThisMonth} /{" "}
                      {rateLimitInfo.monthlyLimit}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* API Keys Table */}
            <Card className="p-6">
              {isLoading ? (
                <div className="text-center py-8 text-gray-600">
                  Loading API keys...
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No API keys yet. Create one to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Prefix</TableHead>
                        <TableHead className="text-right">Requests Today</TableHead>
                        <TableHead className="text-right">Requests This Month</TableHead>
                        <TableHead>Last Used</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiKeys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">{key.name}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {key.prefix}...
                          </TableCell>
                          <TableCell className="text-right">
                            {key.requestsToday}
                          </TableCell>
                          <TableCell className="text-right">
                            {key.requestsThisMonth}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {key.lastUsedAt
                              ? formatDate(key.lastUsedAt)
                              : "Never"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this API key? This cannot be undone."
                                  )
                                ) {
                                  deleteApiKey(key.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Create API Key Dialog */}
      <Dialog open={showDialog} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {newKey ? "API Key Created" : "Create API Key"}
            </DialogTitle>
            <DialogDescription>
              {newKey
                ? "Copy your API key now. You won't be able to see it again."
                : "Create a new API key for programmatic access"}
            </DialogDescription>
          </DialogHeader>

          {newKey ? (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  API Key
                </Label>
                <div className="flex gap-2">
                  <code className="flex-1 bg-gray-100 p-3 rounded text-sm font-mono break-all">
                    {newKey.key}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(newKey.key, newKey.id)
                    }
                  >
                    {copiedKeyId === newKey.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => handleDialogOpenChange(false)}
                className="w-full"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">API Key Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Production API Key"
                  {...register("name")}
                  disabled={isCreating}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogOpenChange(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Create Key
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
