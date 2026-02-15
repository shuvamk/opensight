# Quick Reference Guide

## File Locations

### Content Scoring
- **Main Page**: `/app/(app)/dashboard/content-score/page.tsx`
- **Components**: `/components/content-score/`
  - `ScoreForm.tsx` - URL input form
  - `ScoreBreakdown.tsx` - Circular score + bar charts
  - `Recommendations.tsx` - Prioritized recommendations list

### Alerts & Notifications
- **Main Page**: `/app/(app)/dashboard/alerts/page.tsx`
- **No reusable components** (page-specific)

### Settings
- **Settings Hub**: `/app/(app)/settings/`
  - `page.tsx` - Redirects to `/settings/profile`
  - `profile/page.tsx` - User profile & password
  - `api-keys/page.tsx` - API key management
  - `billing/page.tsx` - Plan & usage info
  - `notifications/page.tsx` - Alert preferences

- **Shared Component**: `/components/settings/SettingsSidebar.tsx`

## Key API Endpoints

### Content Scoring
```
POST   /api/content/score
GET    /api/content/score/history
```

### Notifications
```
GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all
GET    /api/notifications/settings
PATCH  /api/notifications/settings
```

### User & Settings
```
GET    /api/user/profile
PATCH  /api/user/profile
PATCH  /api/user/password
```

### API Keys
```
GET    /api/api-keys
POST   /api/api-keys
DELETE /api/api-keys/:id
GET    /api/api-keys/rate-limit
```

## Reusable Patterns

### Basic Query with Loading
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["key"],
  queryFn: () => apiClient.get("/api/endpoint"),
});

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error!</div>;
```

### Mutation with Toast
```typescript
const { mutate, isPending } = useMutation({
  mutationFn: (data) => apiClient.post("/api/endpoint", data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["key"] });
    toast.success("Success!");
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
```

### Form with Validation
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <Input {...register("field")} />
    {errors.field && <p>{errors.field.message}</p>}
    <Button type="submit" disabled={isPending}>Submit</Button>
  </form>
);
```

## Color Coding System

### Content Score
- **Green** (80+): Excellent ✓
- **Amber** (60-79): Good
- **Red** (<60): Needs Work

### Notification Types
- **Red**: Visibility Drop
- **Blue**: New Mention
- **Orange**: Sentiment Shift
- **Purple**: New Competitor

### Priority Badges
- **Red**: High Priority
- **Amber**: Medium Priority
- **Blue**: Low Priority

## Component Props

### ScoreForm
```typescript
interface ScoreFormProps {
  onScoreSubmit: (url: string) => Promise<void>;
  isLoading?: boolean;
}
```

### ScoreBreakdown
```typescript
interface ScoreBreakdownProps {
  totalScore: number;
  dimensions: Array<{ name: string; score: number }>;
}
```

### Recommendations
```typescript
interface Recommendation {
  id: string;
  dimension: string;
  action: string;
  severity: "high" | "medium" | "low";
}

interface RecommendationsProps {
  recommendations: Recommendation[];
}
```

## Common UI Components Used

```typescript
// Container
<Card className="p-6">Content</Card>

// Buttons
<Button>Click me</Button>
<Button variant="outline">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>

// Form Elements
<Input placeholder="..." {...register("field")} />
<Label htmlFor="field">Label</Label>
<Checkbox {...register("field")} />
<Select>
  <SelectTrigger><SelectValue /></SelectTrigger>
  <SelectContent>
    <SelectItem value="option">Option</SelectItem>
  </SelectContent>
</Select>

// Data Display
<Badge>Status</Badge>
<Progress value={75} />
<Tabs>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content</TabsContent>
</Tabs>

// Tables
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Header</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>

// Dialogs
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

## Form Validation Examples

### Email
```typescript
email: z.string().email("Invalid email")
```

### URL
```typescript
url: z.string().url("Please enter a valid URL")
```

### Password
```typescript
password: z.string().min(8, "Must be at least 8 characters")
```

### Matching Fields
```typescript
.refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
```

## Icons Available

From `lucide-react`:
- `AlertCircle` - Alert
- `TrendingUp` / `TrendingDown` - Trends
- `Bell` - Notifications
- `User` - Profile
- `Key` - API Keys
- `CreditCard` - Billing
- `Loader2` - Loading spinner
- `Copy` - Copy to clipboard
- `Check` - Checkmark
- `Trash2` - Delete
- `MessageSquare` - Mentions
- `BarChart3` - Analytics
- `Clock` - Timestamps
- `ExternalLink` - External links
- `CheckCircle2` - Success state
- `Upload` - File upload

## Responsive Breakpoints

```typescript
// Mobile first, then add desktop styles
<div className="md:grid md:grid-cols-4">
  <aside className="hidden md:block">Sidebar</aside>
  <main className="md:col-span-3">Content</main>
</div>
```

## Common Classes

```typescript
// Spacing
p-4, py-2, px-4, m-2, gap-4, space-y-4

// Text
text-sm, text-base, text-lg, font-semibold, font-bold

// Colors
bg-gray-50, text-gray-600, border-gray-200

// Layout
flex, grid, w-full, h-screen, overflow-y-auto

// Responsive
hidden md:block, md:grid-cols-3
```

## Error Messages Pattern

```typescript
{formState.errors.field && (
  <p className="text-sm text-red-500 mt-1">
    {formState.errors.field.message}
  </p>
)}
```

## Success Feedback

```typescript
toast.success("Action completed!");
toast.error("Something went wrong");
toast.loading("Processing...");
```

## Loading States

```typescript
// Button
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
  Submit
</Button>

// Form
<Input disabled={isLoading} />

// Container
{isLoading ? <div>Loading...</div> : <div>Content</div>}
```

## Empty States

```typescript
{items.length === 0 ? (
  <Card className="p-8">
    <div className="text-center text-gray-600">
      No items found
    </div>
  </Card>
) : (
  <div>List of items</div>
)}
```

## Accessibility

```typescript
// Link error messages to inputs
<Input aria-describedby={errors.field ? "field-error" : undefined} />
{errors.field && <p id="field-error">{errors.field.message}</p>}

// Label associations
<Label htmlFor="fieldId">Label</Label>
<Input id="fieldId" />

// Disabled states
<Button disabled={isPending}>Submit</Button>
```
