# Open Resume Builder - Project Blueprint

This document outlines the technical architecture and design of the Open Resume Builder application.

## Core Philosophy

- **Client-Centric**: The application performs all major data processing and AI interactions on the client-side. This minimizes server load, reduces complexity, and keeps user data (including API keys) within the browser.
- **Component-Based UI**: Built with React and `shadcn/ui`, promoting a modular, reusable, and maintainable user interface.
- **Type-Safe**: Leverages TypeScript and Zod for robust data validation and type safety, from form inputs to API interactions.
- **Dynamic Configuration**: Templates and thumbnails are loaded dynamically from JSON configuration and asset files, enabling unlimited template expansion without code changes.
- **Async Architecture**: All template loading operations use async/await patterns for optimal performance and user experience.

## Architecture Overview

### Frontend

- **Framework**: Next.js 15 with the App Router.
- **Main Page (`src/app/page.tsx`)**: This is the application's entry point and serves as the primary controller for the UI and application state.
  - **State Management**: React Hooks (`useState`, `useEffect`) manage the application's overall state, including the current step (`'welcome'`, `'form'`, `'result'`), loading status, and resume data.
  - **Form Handling**: `react-hook-form` orchestrates the multi-step resume creation process. It handles form state, validation, and submission.
  - **UI Rendering**: The `renderContent` function acts as a router, displaying different components based on the current `appState`.
- **UI Components (`/src/components/ui`)**: A comprehensive set of reusable UI components provided by `shadcn/ui`, such as `Button`, `Card`, `Input`, and `Dialog`.
- **Styling**: `tailwindcss` is used for utility-first styling. The base theme and custom styles are defined in `src/app/globals.css`.

### Data and Schema

- **Schema (`src/lib/schema.ts`)**: Zod schemas define the data structure for the resume (`resumeFormSchema`) and the AI enhancement form (`jobDescriptionSchema`). These schemas are the single source of truth for data validation.
- **Static Data**:
  - `src/lib/ai/gemini_models.json`: A list of available Gemini models for the AI enhancement feature.
  - Sample data available for form demonstration purposes.
- **Dynamic Template System**:
  - **Configuration**: `public/templates/templates.json` - Central configuration with template metadata
  - **HTML Templates**: `public/templates/html/*.html` - Template implementations
  - **Thumbnails**: `public/templates/thumbnails/*.svg` - Visual previews
  - **Loading**: Templates are loaded dynamically using async functions from `src/templates/index.ts`
  - **Processing**: Templates are processed by Handlebars-compatible renderer in `src/lib/template-helpers.ts`

### AI Integration (Client-Side)

- **AI Logic (`src/app/page.tsx`)**: The `handleEnhanceSubmit` function orchestrates the client-side AI enhancement.
- **API Communication**: The `callGeminiApi` helper function uses the browser's `fetch` API to send requests directly to the Google Gemini API.
- **Security**: The user's Gemini API key is managed in the client's state and is never stored on a server. It is passed directly to the Gemini API with each request.
- **Prompting**: Prompts are constructed as strings on the client, embedding the user's resume data and the target job description.

## Application Flow

1.  **Welcome**: The user starts at a welcome screen and can either begin a new resume or import existing data from a JSON file.
2.  **Template Selection**: The user chooses from 13 visual templates organized by category (traditional, modern, creative, professional, specialized). Templates are loaded dynamically with real-time thumbnail previews.
3.  **Form Filling**: The user progresses through a multi-step form, entering their contact information, summary, experience, etc.
4.  **Initial Generation**: The user's data is rendered into the selected HTML template to create an initial resume.
5.  **Result Page**: The user can preview the generated resume. From here, they can:
    - **Enhance with AI**: Paste a job description and provide a Gemini API key. The app then performs a client-side API call to get an analysis and an updated resume, which is then displayed.
    - **Edit HTML**: Manually edit the resume's HTML for fine-grained control.
    - **Download/Print**: Export the resume data as JSON or download the final HTML.

## Template System

The application features a **fully dynamic template system** with zero hardcoded components. See [`TEMPLATE_SYSTEM.md`](./TEMPLATE_SYSTEM.md) for complete documentation.

Key features:
- **13 templates** organized in 5 categories with visual thumbnails
- **JSON configuration** for all template metadata  
- **Automated management** with 4 shell scripts for complete lifecycle
- **Zero code changes** required for adding new templates
- **Dynamic loading** of both templates and thumbnails at runtime

Quick example:
```bash
./scripts/add-template.sh luxury "Luxury Executive" "Premium design" professional "Luxury,Premium"
# ✅ Template immediately available in the application!
```

This enables unlimited template expansion without requiring code changes or deployment.

## Technical Implementation

The application uses:

- **Next.js 14+** with App Router architecture
- **TypeScript** for type safety and better development experience
- **Tailwind CSS** with shadcn/ui components for consistent, responsive design
- **React Hook Form** with Zod validation for form management
- **Google Gemini API** for AI-powered resume enhancement
- **Dynamic Template Loading** via async functions and JSON configuration
- **SVG Thumbnails** for real-time template previews
- **Client-side Architecture** ensuring user data privacy and security

### Key Components

- **AppState.tsx**: Global state management for resume data and template handling
- **FormStepsContainer.tsx**: Multi-step form navigation and data management
- **TemplateSelectionStep.tsx**: Template browsing with category organization and async loading
- **TemplateThumbnail.tsx**: Dynamic thumbnail rendering with loading states
- **ResultStep.tsx**: Final resume preview with AI enhancement and editing capabilities
- **Templates Index**: Async template loading functions organized by category
- **Management Scripts**: Automation tools for template lifecycle management

## Key Files and Directories

- **`src/app/page.tsx`**: The core of the application logic and UI.
- **`src/app/globals.css`**: Global styles and Tailwind CSS configuration.
- **`src/components/ui/`**: Reusable `shadcn/ui` components.
- **`src/components/form/`**: Multi-step form components including TemplateSelectionStep.tsx
- **`src/components/TemplateThumbnail.tsx`**: Dynamic thumbnail rendering component
- **`src/lib/`**: Contains helper functions (`utils.ts`), data schemas (`schema.ts`), template helpers (`template-helpers.ts`), and AppState management
- **`src/templates/index.ts`**: Async template loading functions organized by category
- **`public/templates/`**: Complete template system with JSON config, HTML templates, and SVG thumbnails
- **`scripts/`**: Template management automation scripts
- **`package.json`**: Defines project dependencies and scripts.
