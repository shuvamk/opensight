"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBrandSchema, createCompetitorSchema } from "@opensight/shared";
import * as brandsApi from "@/lib/api/brands";
import * as promptsApi from "@/lib/api/prompts";
import * as competitorsApi from "@/lib/api/competitors";
import { useBrandStore } from "@/stores/brand-store";
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
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, X, Plus, Loader2 } from "lucide-react";

const INDUSTRIES = [
  "SaaS",
  "E-commerce",
  "Finance",
  "Healthcare",
  "Agency",
  "Other",
];

const brandFormSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  website_url: z.string().url("Invalid URL format"),
  industry: z.string().optional(),
});

const competitorFormSchema = z.object({
  competitors: z.array(
    z.object({
      name: z.string(),
      website_url: z.string(),
    })
  ),
});

type BrandFormInput = z.infer<typeof brandFormSchema>;
type CompetitorFormInput = z.infer<typeof competitorFormSchema>;

interface OnboardingState {
  brandData: BrandFormInput | null;
  selectedPrompts: string[];
  customPrompts: string[];
  competitors: Array<{ name: string; website_url: string }>;
}

const SAMPLE_PROMPTS = [
  "How does our brand voice compare to competitors?",
  "What are the most common customer pain points mentioned?",
  "How does our pricing messaging differ from the industry average?",
  "What are the top keywords used in competitor content?",
  "How is our product differentiation perceived online?",
  "What customer success stories are mentioned most?",
  "How does our customer support reputation compare?",
  "What are the trending topics in our industry?",
  "How do reviews mention specific features?",
  "What's the sentiment around our latest product update?",
  "How do we compare on sustainability messaging?",
  "What are common objections mentioned in reviews?",
  "How does our brand appear in social media discussions?",
  "What partnerships or integrations are most mentioned?",
  "How is our customer onboarding perceived?",
  "What are the most requested features by customers?",
  "How does our content strategy compare to competitors?",
  "What industry trends are our customers discussing?",
  "How is our pricing transparency perceived?",
  "What are the top reasons customers switch from competitors?",
];

export default function OnboardingPage() {
  const router = useRouter();
  const setActiveBrand = useBrandStore((state) => state.setActiveBrand);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(SAMPLE_PROMPTS);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [customPromptInput, setCustomPromptInput] = useState("");

  const [state, setState] = useState<OnboardingState>({
    brandData: null,
    selectedPrompts: [],
    customPrompts: [],
    competitors: [{ name: "", website_url: "" }],
  });

  // Step 1: Brand Info Form
  const brandForm = useForm<BrandFormInput>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: "",
      website_url: "",
      industry: "",
    },
  });

  // Step 3: Competitors Form
  const competitorForm = useForm<CompetitorFormInput>({
    resolver: zodResolver(competitorFormSchema),
    defaultValues: {
      competitors: [{ name: "", website_url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: competitorForm.control,
    name: "competitors",
  });

  const handleBrandSubmit = async (data: BrandFormInput) => {
    setState((prev) => ({
      ...prev,
      brandData: data,
    }));

    // Generate suggested prompts
    setIsGeneratingPrompts(true);
    try {
      // Simulate API call to generate prompts based on brand
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuggestedPrompts(SAMPLE_PROMPTS);
      setStep(2);
    } catch (error) {
      toast.error("Failed to generate prompt suggestions");
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  const handleAddCustomPrompt = () => {
    if (customPromptInput.trim()) {
      setState((prev) => ({
        ...prev,
        customPrompts: [...prev.customPrompts, customPromptInput.trim()],
      }));
      setCustomPromptInput("");
    }
  };

  const handleRemoveCustomPrompt = (index: number) => {
    setState((prev) => ({
      ...prev,
      customPrompts: prev.customPrompts.filter((_, i) => i !== index),
    }));
  };

  const handleTogglePrompt = (prompt: string) => {
    setState((prev) => ({
      ...prev,
      selectedPrompts: prev.selectedPrompts.includes(prompt)
        ? prev.selectedPrompts.filter((p) => p !== prompt)
        : [...prev.selectedPrompts, prompt],
    }));
  };

  const handlePromptsSubmit = () => {
    if (state.selectedPrompts.length === 0 && state.customPrompts.length === 0) {
      toast.error("Please select at least one prompt");
      return;
    }
    setStep(3);
  };

  const handleCompetitorSubmit = async (data: CompetitorFormInput) => {
    const validCompetitors = data.competitors.filter(
      (c) => c.name.trim() && c.website_url.trim()
    );
    setState((prev) => ({
      ...prev,
      competitors: validCompetitors,
    }));
    setStep(4);
  };

  const handleComplete = async () => {
    if (!state.brandData) {
      toast.error("Missing brand data");
      return;
    }

    setIsLoading(true);
    try {
      // Create brand (API returns { brand })
      const brand = await brandsApi.createBrand({
        name: state.brandData.name,
        website_url: state.brandData.website_url,
        industry: state.brandData.industry,
      });

      const brandId = brand.id;
      setActiveBrand(brandId);

      // Bulk create prompts (API: POST /brands/:id/prompts with { prompts: [...] })
      const allPrompts = [
        ...state.selectedPrompts.map((text) => ({ text, tags: [] as string[] })),
        ...state.customPrompts.map((text) => ({ text, tags: [] as string[] })),
      ];

      if (allPrompts.length > 0) {
        await promptsApi.createBulkPrompts(brandId, { prompts: allPrompts });
      }

      // Create competitors
      if (state.competitors.length > 0) {
        for (const competitor of state.competitors) {
          await competitorsApi.addCompetitor(brandId, {
            name: competitor.name,
            website_url: competitor.website_url,
          });
        }
      }

      toast.success("Onboarding complete!");
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to complete onboarding";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = (step / 4) * 100;

  return (
    <Card className="w-full max-w-[600px]">
      <CardHeader>
        <Progress value={progressPercentage} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <CardTitle className="text-xl">Tell us about your brand</CardTitle>
              <CardDescription>Step 1 of 4</CardDescription>
            </div>

            <form onSubmit={brandForm.handleSubmit(handleBrandSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Acme Corp"
                  disabled={isGeneratingPrompts}
                  {...brandForm.register("name")}
                />
                {brandForm.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {brandForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  type="url"
                  placeholder="https://example.com"
                  disabled={isGeneratingPrompts}
                  {...brandForm.register("website_url")}
                />
                {brandForm.formState.errors.website_url && (
                  <p className="text-sm text-destructive">
                    {brandForm.formState.errors.website_url.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={brandForm.watch("industry") || ""}
                  onValueChange={(value) =>
                    brandForm.setValue("industry", value)
                  }
                  disabled={isGeneratingPrompts}
                >
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {brandForm.formState.errors.industry && (
                  <p className="text-sm text-destructive">
                    {brandForm.formState.errors.industry.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isGeneratingPrompts || brandForm.formState.isSubmitting}
                >
                  {isGeneratingPrompts ? "Generating prompts..." : "Continue"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <CardTitle className="text-xl">Select analysis prompts</CardTitle>
              <CardDescription>
                Step 2 of 4 - Choose what to analyze about your brand
              </CardDescription>
            </div>

            {isGeneratingPrompts ? (
              <div className="flex justify-center py-8">
                <div className="space-y-2 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Generating suggestions...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="max-h-[300px] space-y-3 overflow-y-auto">
                  {suggestedPrompts.map((prompt, index) => (
                    <div key={index} className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-slate-50">
                      <input
                        type="checkbox"
                        id={`prompt-${index}`}
                        checked={state.selectedPrompts.includes(prompt)}
                        onChange={() => handleTogglePrompt(prompt)}
                        className="mt-1 h-4 w-4 cursor-pointer"
                      />
                      <label
                        htmlFor={`prompt-${index}`}
                        className="flex-1 cursor-pointer text-sm leading-relaxed"
                      >
                        {prompt}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <Label htmlFor="customPrompt">Add custom prompt</Label>
                  <div className="flex gap-2">
                    <Input
                      id="customPrompt"
                      placeholder="Enter a custom analysis prompt"
                      value={customPromptInput}
                      onChange={(e) => setCustomPromptInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomPrompt();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleAddCustomPrompt}
                      disabled={!customPromptInput.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {state.customPrompts.length > 0 && (
                  <div className="space-y-2 border-t pt-4">
                    <Label>Custom prompts</Label>
                    <div className="space-y-2">
                      {state.customPrompts.map((prompt, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3"
                        >
                          <span className="text-sm text-blue-900">{prompt}</span>
                          <button
                            onClick={() => handleRemoveCustomPrompt(index)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={handlePromptsSubmit}
                  >
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <CardTitle className="text-xl">Add competitors</CardTitle>
              <CardDescription>
                Step 3 of 4 - Add up to 5 competitors to track
              </CardDescription>
            </div>

            <form
              onSubmit={competitorForm.handleSubmit(handleCompetitorSubmit)}
              className="space-y-4"
            >
              <div className="max-h-[300px] space-y-4 overflow-y-auto">
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Competitor {index + 1}</Label>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`name-${index}`} className="text-xs">
                        Name
                      </Label>
                      <Input
                        id={`name-${index}`}
                        placeholder="Competitor name"
                        {...competitorForm.register(`competitors.${index}.name`)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`url-${index}`} className="text-xs">
                        Website URL
                      </Label>
                      <Input
                        id={`url-${index}`}
                        type="url"
                        placeholder="https://example.com"
                        {...competitorForm.register(`competitors.${index}.website_url`)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {fields.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => append({ name: "", website_url: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add competitor
                </Button>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(2)}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(4)}
                >
                  Skip
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={competitorForm.formState.isSubmitting}
                >
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <CardTitle className="text-xl">Confirm & Start</CardTitle>
              <CardDescription>Step 4 of 4 - Review your setup</CardDescription>
            </div>

            <div className="space-y-4">
              <div className="space-y-3 rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Brand Name</p>
                  <p className="font-semibold">{state.brandData?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Website</p>
                  <p className="text-sm text-primary">{state.brandData?.website_url}</p>
                </div>
                {state.brandData?.industry && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Industry</p>
                    <p className="font-semibold capitalize">{state.brandData.industry}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Prompts ({state.selectedPrompts.length + state.customPrompts.length})
                </p>
                <div className="max-h-[150px] space-y-2 overflow-y-auto">
                  {state.selectedPrompts.map((prompt, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      <span className="font-medium">•</span> {prompt}
                    </div>
                  ))}
                  {state.customPrompts.map((prompt, index) => (
                    <div key={`custom-${index}`} className="text-xs text-blue-600">
                      <span className="font-medium">•</span> {prompt}
                    </div>
                  ))}
                </div>
              </div>

              {state.competitors.length > 0 && (
                <div className="space-y-3 rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Competitors ({state.competitors.length})
                  </p>
                  <div className="space-y-2">
                    {state.competitors.map((competitor, index) => (
                      <div key={index} className="text-xs">
                        <p className="font-medium">{competitor.name}</p>
                        <p className="text-gray-600">{competitor.website_url}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex justify-center py-8">
                  <div className="space-y-2 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Starting your analysis...
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(3)}
                  disabled={isLoading}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={handleComplete}
                  disabled={isLoading}
                >
                  {isLoading ? "Starting..." : "Start Analysis"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
