# Graph Report - FaceSkinApp  (2026-10-11)

## Corpus Check
- 171 files · ~91,977 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .ttf 3, .css 2, .wasm 2)

## Summary
- 1860 nodes · 3629 edges · 153 communities (88 shown, 65 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 99 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e78cd206`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- Product Decisions and References
- react
- vision_bundle.mjs
- sidebar.tsx
- contracts.ts
- Button
- progress.ts
- utils.ts
- n
- tn
- analyze-handler.ts
- G
- package.json
- Build and Test Dependencies
- field.tsx
- host-binding.mjs
- UI Package Dependencies
- geometry.ts
- clone
- radix-ui
- Command Palette Dialogs
- AppError
- lucide-react
- TypeScript Compiler Configuration
- Component Generator Configuration
- m
- SIMD WebAssembly Startup
- Baseline WebAssembly Startup
- connector-preview-session.mjs
- form.tsx
- Authentication and App Layout
- menubar.tsx
- ya
- install-ci.mjs
- Carousel Components
- Chart Components
- pnpm-install.mjs
- Sites Environment Setup
- catalog.ts
- SIMD Exception Handling
- Baseline Exception Handling
- Attachment Display Components
- Drawer Components
- Connector Type Contracts
- ee
- Select Input Components
- notes/route.ts
- Responsive Website Previews
- Vite and Sites Configuration
- Navigation Menu Components
- Connector Request Context
- Package Script Commands
- SIMD Lazy Files
- Baseline Lazy Files
- Popover Components
- zr
- PNPM Bootstrap Script
- Chat Bubble Components
- Progress Card QA Preview
- SIMD GPU Bindings
- Baseline GPU Bindings
- Alert Display Components
- Resizable Panel Components
- Analysis Quota Database Migration
- SIMD Runtime Initialization
- SIMD Runtime Execution
- SIMD GPU Color States
- SIMD GPU Vertex Buffers
- Baseline Runtime Initialization
- Baseline Runtime Execution
- Baseline GPU Color States
- Baseline GPU Vertex Buffers
- CI Installation Settings
- NPM Installation Progress
- empty.tsx
- Toast Notifications and Themes
- ESLint Configuration
- SIMD Fullscreen Handling
- SIMD Terminal System Calls
- SIMD GPU Render Passes
- Baseline Fullscreen Handling
- Baseline Terminal System Calls
- Baseline GPU Render Passes
- Face Asset Integrity Setup
- Cloudflare Environment Types
- Package Dependency Overrides
- Editorial Portrait Illustration
- Glowup App Icon
- Glowup Brand Wordmark
- iPhone subscriptions and launch pricing
- SIMD File Writes
- SIMD Filesystem Synchronization
- Baseline File Writes
- Baseline Filesystem Synchronization
- Graphify Navigation Instructions
- marker.tsx
- PostCSS Configuration
- Legacy Face Favicon
- Document File Icon
- Globe Icon
- SIMD File Synchronization
- SIMD Return Conversion
- SIMD Debug Output
- SIMD Exit Status
- SIMD Pointer Conversion
- SIMD Link Resolution
- SIMD GPU Depth States
- SIMD Type Registration
- SIMD Filesystem Statistics
- Baseline File Synchronization
- Baseline Return Conversion
- Baseline Debug Output
- Baseline Exit Status
- Baseline Pointer Conversion
- Baseline Link Resolution
- Baseline GPU Depth States
- Baseline Type Registration
- Baseline Filesystem Statistics
- Browser Window Icon
- Verified Build Script
- Quota Test Schema
- Shadcn License Terms
- SIMD Runtime Get User Media
- SIMD Runtime Ioctl
- SIMD Runtime Llseek
- SIMD Runtime Lookup
- SIMD Runtime Mknod
- SIMD Runtime Mount
- SIMD Runtime Readdir
- SIMD Runtime Rename
- SIMD Runtime Rmdir
- SIMD Runtime Symlink
- SIMD Runtime Unlink
- Baseline Runtime Get User Media
- Baseline Runtime Ioctl
- Baseline Runtime Llseek
- Baseline Runtime Lookup
- Baseline Runtime Mknod
- Baseline Runtime Mount
- Baseline Runtime Readdir
- Baseline Runtime Rename
- Baseline Runtime Rmdir
- Baseline Runtime Symlink
- Baseline Runtime Unlink
- Bi
- 0001_subscription_access.sql
- drizzle-kit
- engines

## God Nodes (most connected - your core abstractions)
1. `cn()` - 327 edges
2. `react` - 59 edges
3. `m()` - 41 edges
4. `radix-ui` - 38 edges
5. `n()` - 31 edges
6. `lucide-react` - 30 edges
7. `Button()` - 26 edges
8. `e()` - 26 edges
9. `r()` - 26 edges
10. `G()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `Clinical norms, selected aesthetic samples and software conventions differ` --semantically_similar_to--> `Current mesh ratios are incompatible with proposed study reference formulas`  [INFERRED] [semantically similar]
  docs/references/Looksmax.pdf → docs/future-ratio-references.md
- `AccordionItem()` --calls--> `cn()`  [EXTRACTED]
  components/ui/accordion.tsx → lib/utils.ts
- `AccordionTrigger()` --calls--> `cn()`  [EXTRACTED]
  components/ui/accordion.tsx → lib/utils.ts
- `AccordionContent()` --calls--> `cn()`  [EXTRACTED]
  components/ui/accordion.tsx → lib/utils.ts
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Explicit local numeric check-in to branded user-controlled export** — docs_api_contract_photo_estimates, docs_progress_sharing_local_checkins, docs_progress_sharing_progress_card, docs_progress_sharing_privacy [EXTRACTED 1.00]

## Communities (153 total, 65 thin omitted)

### Community 2 - "cn"
Cohesion: 0.04
Nodes (58): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem() (+50 more)

### Community 3 - "Product Decisions and References"
Cohesion: 0.05
Nodes (37): Historical FaceSkin design system, Approved glowup visual system, Locally hosted DM Sans and DM Serif Display, Account transfer continuation brief, Original account-bound private Site: saved version 4, no deployment, Analysis API v1 contract, JPEG/PNG/WebP upload: 10 MiB, header scan 1 MiB, dimensions 32–4096, POST /api/analyze: image, questionnaire, geometry and explicit consent (+29 more)

### Community 4 - "react"
Cohesion: 0.06
Nodes (17): AccordionContent(), AccordionItem(), AccordionTrigger(), Checkbox(), HoverCardContent(), InputOTP(), InputOTPGroup(), InputOTPSlot() (+9 more)

### Community 5 - "vision_bundle.mjs"
Cohesion: 0.08
Nodes (35): da(), delete(), dr(), er(), fc(), fi(), finishProcessing(), forEach() (+27 more)

### Community 6 - "sidebar.tsx"
Cohesion: 0.07
Nodes (39): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle() (+31 more)

### Community 7 - "contracts.ts"
Cohesion: 0.12
Nodes (21): defaults, Dependencies, State, AnalysisResults(), LandmarkOverlay(), SkinQuestionnaire(), AnalyzeResult, AnalyzeResultSchema (+13 more)

### Community 8 - "Button"
Cohesion: 0.08
Nodes (29): ConnectorError(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogMedia() (+21 more)

### Community 9 - "progress.ts"
Cohesion: 0.15
Nodes (25): ProgressCards(), clear(), invalidate(), makePreview(), save(), selectDefaults(), share(), RatioIdSchema (+17 more)

### Community 10 - "utils.ts"
Cohesion: 0.10
Nodes (25): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty(), ComboboxGroup(), ComboboxInput() (+17 more)

### Community 11 - "n"
Cohesion: 0.15
Nodes (33): aa(), baseOptions(), bn(), ca(), constructor(), dc(), e(), fa() (+25 more)

### Community 12 - "tn"
Cohesion: 0.17
Nodes (32): an(), ci(), cn(), de(), dn(), en(), hn(), ht() (+24 more)

### Community 13 - "analyze-handler.ts"
Cohesion: 0.18
Nodes (18): dynamic, POST(), dynamic, GET(), eligibleProducts(), loadCatalog(), loadReference(), boundedForm() (+10 more)

### Community 14 - "G"
Cohesion: 0.13
Nodes (32): ae(), at(), bt, ce(), cr(), Ct(), Dt(), fe() (+24 more)

### Community 15 - "package.json"
Cohesion: 0.07
Nodes (26): name, private, type, version, @cloudflare/vite-plugin, @cloudflare/workers-types, clsx, date-fns (+18 more)

### Community 16 - "Build and Test Dependencies"
Cohesion: 0.07
Nodes (27): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, drizzle-kit, eslint, eslint-config-next, jsdom, json-rpc-2.0 (+19 more)

### Community 17 - "field.tsx"
Cohesion: 0.18
Nodes (12): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+4 more)

### Community 18 - "host-binding.mjs"
Cohesion: 0.11
Nodes (16): raw-body, createPreviewBinding(), failure(), messages, publicResult(), readRetryAfterMs(), requestIdSchema, resultSchema (+8 more)

### Community 19 - "UI Package Dependencies"
Cohesion: 0.08
Nodes (26): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, date-fns, drizzle-orm, embla-carousel-react (+18 more)

### Community 20 - "geometry.ts"
Cohesion: 0.13
Nodes (18): FaceGeometrySchema, Point, computeRatios(), selectSingleFace(), unsuitable(), validateFaceQuality(), v, @testing-library/react (+10 more)

### Community 21 - "clone"
Cohesion: 0.18
Nodes (22): $a(), ba(), clear(), clone(), close(), D(), ea(), ec() (+14 more)

### Community 22 - "radix-ui"
Cohesion: 0.07
Nodes (32): Badge(), badgeVariants, ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Item(), ItemActions() (+24 more)

### Community 23 - "Command Palette Dialogs"
Cohesion: 0.15
Nodes (17): Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut() (+9 more)

### Community 24 - "AppError"
Cohesion: 0.14
Nodes (19): AppError, ModelResultSchema, canvasBlob(), detectFace(), PreparedPhoto, preparePhoto(), MAX_PHOTO_BYTES, readPhotoDimensions() (+11 more)

### Community 25 - "lucide-react"
Cohesion: 0.20
Nodes (10): dynamic, Home(), AnalysisFlow(), PhotoInput(), SkincareIntro(), SubscriptionPaywall(), analysisBudget, subscriptionPlans (+2 more)

### Community 26 - "TypeScript Compiler Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 27 - "Component Generator Configuration"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, registries, rsc (+9 more)

### Community 28 - "m"
Cohesion: 0.17
Nodes (19): as(), cc(), ds(), fs(), ga(), ge(), gn(), Ho() (+11 more)

### Community 29 - "SIMD WebAssembly Startup"
Cohesion: 0.12
Nodes (18): abort(), assert(), assignWasmExports(), createWasm(), receiveInstance(), receiveInstantiationResult(), findWasmBinary(), forceLoadFile() (+10 more)

### Community 30 - "Baseline WebAssembly Startup"
Cohesion: 0.12
Nodes (18): abort(), assert(), assignWasmExports(), createWasm(), receiveInstance(), receiveInstantiationResult(), findWasmBinary(), forceLoadFile() (+10 more)

### Community 31 - "connector-preview-session.mjs"
Cohesion: 0.13
Nodes (16): json-rpc-2.0, active, binding, close(), descriptor, directory, emit(), grants (+8 more)

### Community 32 - "form.tsx"
Cohesion: 0.21
Nodes (11): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue, FormLabel() (+3 more)

### Community 33 - "Authentication and App Layout"
Cohesion: 0.17
Nodes (11): chatGPTSignInPath(), chatGPTSignOutPath(), ChatGPTUser, getChatGPTUser(), isReservedAuthPath(), requireChatGPTUser(), safeDecodeURIComponent(), safeRelativeReturnPath() (+3 more)

### Community 34 - "menubar.tsx"
Cohesion: 0.12
Nodes (12): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarPortal(), MenubarRadioItem(), MenubarSeparator() (+4 more)

### Community 35 - "ya"
Cohesion: 0.17
Nodes (16): B(), Bc(), eh(), F(), ia(), j(), je(), Kc() (+8 more)

### Community 36 - "install-ci.mjs"
Cohesion: 0.27
Nodes (4): readExecutionProfile(), cli, [command, ...args], projectRoot

### Community 37 - "Carousel Components"
Cohesion: 0.17
Nodes (14): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+6 more)

### Community 38 - "Chart Components"
Cohesion: 0.20
Nodes (13): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+5 more)

### Community 39 - "pnpm-install.mjs"
Cohesion: 0.21
Nodes (10): CACHE_SEEDS, holdInstallLocks(), InstallProgress, main(), openLock(), openReport(), OPERATIONAL_FAILURE_CODES, showLine() (+2 more)

### Community 40 - "Sites Environment Setup"
Cohesion: 0.14
Nodes (13): HOME, MINIFLARE_REGISTRY_PATH, npm_config_audit, npm_config_cache, npm_config_fund, npm_config_update_notifier, sites-env.sh script, SITES_ENV_READY (+5 more)

### Community 41 - "catalog.ts"
Cohesion: 0.14
Nodes (12): currencies, https, parseCatalog(), Product, ProductSchema, Questionnaire, Ratio, baseGuidance (+4 more)

### Community 44 - "Attachment Display Components"
Cohesion: 0.20
Nodes (11): Attachment(), AttachmentAction(), AttachmentActions(), AttachmentContent(), AttachmentDescription(), AttachmentGroup(), AttachmentMedia(), attachmentMediaVariants (+3 more)

### Community 45 - "Drawer Components"
Cohesion: 0.20
Nodes (8): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerPortal(), DrawerTitle(), vaul

### Community 46 - "Connector Type Contracts"
Cohesion: 0.17
Nodes (10): ./connector-contract.mjs, ConnectorBinding, ConnectorContent, ConnectorContext, ConnectorFailureStatus, ConnectorResult, Json, Cloudflare (+2 more)

### Community 47 - "ee"
Cohesion: 0.11
Nodes (6): di(), ee(), entries(), ft, [Symbol.iterator](), values()

### Community 48 - "Select Input Components"
Cohesion: 0.22
Nodes (7): SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger()

### Community 49 - "notes/route.ts"
Cohesion: 0.30
Nodes (7): getDb(), analysisReservations, GET(), POST(), toRouteErrorMessage(), notes, drizzle-orm

### Community 50 - "Responsive Website Previews"
Cohesion: 0.18
Nodes (11): Consent to OpenAI processing and optional device-only progress storage, Ivory and coral editorial hero with portrait illustration, Desktop glowup website preview, Photo upload alongside skin questionnaire, Optional dated check-ins for a shareable progress card, Owner API key and usage protection setup required, glowup wordmark with coral icon and warm ivory styling, Mobile glowup website preview (+3 more)

### Community 51 - "Vite and Sites Configuration"
Cohesion: 0.20
Nodes (3): vinext, vite, localBindingConfig

### Community 52 - "Navigation Menu Components"
Cohesion: 0.24
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 53 - "Connector Request Context"
Cohesion: 0.31
Nodes (3): bindings, getConnectorBinding(), connectorsForRequest()

### Community 54 - "Package Script Commands"
Cohesion: 0.22
Nodes (9): scripts, build, db:generate, dev, install:ci, lint, start, test (+1 more)

### Community 55 - "SIMD Lazy Files"
Cohesion: 0.31
Nodes (7): createLazyFile(), stream_ops, writeChunks(), get_char(), mmap(), position(), read()

### Community 56 - "Baseline Lazy Files"
Cohesion: 0.31
Nodes (7): createLazyFile(), stream_ops, writeChunks(), get_char(), mmap(), position(), read()

### Community 57 - "Popover Components"
Cohesion: 0.25
Nodes (4): PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle()

### Community 58 - "zr"
Cohesion: 0.50
Nodes (9): ei(), gr(), Kr(), ni(), pt(), ri(), ti(), Vi() (+1 more)

### Community 59 - "PNPM Bootstrap Script"
Cohesion: 0.39
Nodes (7): acquire_shared_lock(), can_write_directory(), release_shared_lock(), report_store(), install-pnpm.sh script, XDG_CACHE_HOME, XDG_DATA_HOME

### Community 60 - "Chat Bubble Components"
Cohesion: 0.38
Nodes (6): Bubble(), BubbleContent(), BubbleGroup(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 61 - "Progress Card QA Preview"
Cohesion: 0.33
Nodes (6): Earlier and later dated check-in selectors, Synthetic mobile progress-card QA screenshot, Photo-condition changes are not an improvement score, Selectable face-width, inner-eye-gap and mouth-width ratios, Branded card preview with download and share controls, Synthetic QA check-ins explicitly identified as test fixtures

### Community 62 - "SIMD GPU Bindings"
Cohesion: 0.33
Nodes (6): makeBufferEntry(), makeEntries(), makeEntry(), makeSamplerEntry(), makeStorageTextureEntry(), makeTextureEntry()

### Community 63 - "Baseline GPU Bindings"
Cohesion: 0.33
Nodes (6): makeBufferEntry(), makeEntries(), makeEntry(), makeSamplerEntry(), makeStorageTextureEntry(), makeTextureEntry()

### Community 64 - "Alert Display Components"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 65 - "Resizable Panel Components"
Cohesion: 0.40
Nodes (3): ResizableHandle(), ResizablePanelGroup(), react-resizable-panels

### Community 66 - "Analysis Quota Database Migration"
Cohesion: 0.70
Nodes (4): `analysis_reservations`, usage_day, usage_expiry, usage_visitor_hour

### Community 68 - "SIMD Runtime Execution"
Cohesion: 0.40
Nodes (5): initRuntime(), postRun(), preRun(), run(), doRun()

### Community 69 - "SIMD GPU Color States"
Cohesion: 0.40
Nodes (5): makeBlendComponent(), makeBlendState(), makeColorState(), makeColorStates(), makeFragmentState()

### Community 70 - "SIMD GPU Vertex Buffers"
Cohesion: 0.40
Nodes (5): makeVertexAttribute(), makeVertexAttributes(), makeVertexBuffer(), makeVertexBuffers(), makeVertexState()

### Community 72 - "Baseline Runtime Execution"
Cohesion: 0.40
Nodes (5): initRuntime(), postRun(), preRun(), run(), doRun()

### Community 73 - "Baseline GPU Color States"
Cohesion: 0.40
Nodes (5): makeBlendComponent(), makeBlendState(), makeColorState(), makeColorStates(), makeFragmentState()

### Community 74 - "Baseline GPU Vertex Buffers"
Cohesion: 0.40
Nodes (5): makeVertexAttribute(), makeVertexAttributes(), makeVertexBuffer(), makeVertexBuffers(), makeVertexState()

### Community 75 - "CI Installation Settings"
Cohesion: 0.40
Nodes (4): NPM_CONFIG_FETCH_RETRIES, NPM_CONFIG_FETCH_TIMEOUT, NPM_CONFIG_MAXSOCKETS, install-ci.sh script

### Community 77 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 79 - "ESLint Configuration"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 80 - "SIMD Fullscreen Handling"
Cohesion: 0.50
Nodes (4): getFullscreenElement(), requestFullscreen(), fullscreenChange(), updateCanvasDimensions()

### Community 81 - "SIMD Terminal System Calls"
Cohesion: 0.50
Nodes (4): ioctl_tcgets(), ioctl_tcsets(), ioctl_tiocgwinsz(), ___syscall_ioctl()

### Community 82 - "SIMD GPU Render Passes"
Cohesion: 0.50
Nodes (4): makeColorAttachment(), makeColorAttachments(), makeDepthStencilAttachment(), makeRenderPassDescriptor()

### Community 83 - "Baseline Fullscreen Handling"
Cohesion: 0.50
Nodes (4): getFullscreenElement(), requestFullscreen(), fullscreenChange(), updateCanvasDimensions()

### Community 84 - "Baseline Terminal System Calls"
Cohesion: 0.50
Nodes (4): ioctl_tcgets(), ioctl_tcsets(), ioctl_tiocgwinsz(), ___syscall_ioctl()

### Community 85 - "Baseline GPU Render Passes"
Cohesion: 0.50
Nodes (4): makeColorAttachment(), makeColorAttachments(), makeDepthStencilAttachment(), makeRenderPassDescriptor()

### Community 88 - "Package Dependency Overrides"
Cohesion: 0.67
Nodes (3): sharp, overrides, miniflare

### Community 89 - "Editorial Portrait Illustration"
Cohesion: 0.67
Nodes (3): Warm editorial portrait illustration, Warm peach and ivory pencil and pastel texture, Close portrait with dark hair and visible natural skin texture

### Community 90 - "Glowup App Icon"
Cohesion: 0.67
Nodes (3): Rounded square with orange-to-pink gradient, glowup sparkle app icon, Two white four-point sparkles

### Community 91 - "Glowup Brand Wordmark"
Cohesion: 0.67
Nodes (3): glowup brand logo, Two white four-point sparkles in a rounded gradient square, Lowercase glowup wordmark: dark glow and coral-pink up

### Community 92 - "iPhone subscriptions and launch pricing"
Cohesion: 0.40
Nodes (4): Implemented, iPhone subscriptions and launch pricing, Required before accepting payment, Sources

### Community 93 - "SIMD File Writes"
Cohesion: 0.67
Nodes (3): msync(), put_char(), write()

### Community 94 - "SIMD Filesystem Synchronization"
Cohesion: 1.00
Nodes (3): syncfs(), doCallback(), done()

### Community 95 - "Baseline File Writes"
Cohesion: 0.67
Nodes (3): msync(), put_char(), write()

### Community 96 - "Baseline Filesystem Synchronization"
Cohesion: 1.00
Nodes (3): syncfs(), doCallback(), done()

### Community 99 - "marker.tsx"
Cohesion: 0.50
Nodes (4): Marker(), MarkerContent(), MarkerIcon(), markerVariants

## Ambiguous Edges - Review These
- `Assumed FaceIQ eye-separation definition: IPD divided by face width` → `Pallett, Link and Lee 2010 New Golden Ratios for Facial Beauty`  [AMBIGUOUS]
  docs/references/Looksmax.pdf · relation: conceptually_related_to

## Knowledge Gaps
- **80 isolated node(s):** `@hookform/resolvers`, `date-fns`, `react-dom`, `@mediapipe/tasks-vision`, `@cloudflare/vite-plugin` (+75 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 764 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **65 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `cn`, `sidebar.tsx`, `contracts.ts`, `Button`, `progress.ts`, `utils.ts`, `package.json`, `field.tsx`, `geometry.ts`, `radix-ui`, `Command Palette Dialogs`, `form.tsx`, `menubar.tsx`, `Carousel Components`, `Chart Components`, `Attachment Display Components`, `Drawer Components`, `Select Input Components`, `Navigation Menu Components`, `Popover Components`, `Chat Bubble Components`, `Alert Display Components`, `marker.tsx`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `m()` (e.g. with `e()` and `Ne()`) actually correct?**
  _`m()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@hookform/resolvers`, `date-fns`, `react-dom` to the rest of the system?**
  _80 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `vision_wasm_nosimd_internal.js` be split into smaller, more focused modules?**
  _Cohesion score 0.011834319526627219 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `geometry.ts` to `install-ci.mjs`, `contracts.ts`, `progress.ts`, `analyze-handler.ts`, `package.json`, `AppError`, `lucide-react`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Are the 17 inferred relationships involving `n()` (e.g. with `vision_bundle.mjs` and `dn()`) actually correct?**
  _`n()` has 17 INFERRED edges - model-reasoned connections that need verification._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Assumed FaceIQ eye-separation definition: IPD divided by face width` and `Pallett, Link and Lee 2010 New Golden Ratios for Facial Beauty`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._