# Resume AI - Project Blueprint

This document outlines the technical architecture and design of the Resume AI application.

## 1. Core Philosophy

- **Client-Centric**: The application performs all major data processing and AI interactions on the client-side. This minimizes server load, reduces complexity, and keeps user data (including API keys) within the browser.
- **Component-Based UI**: Built with React and `shadcn/ui`, promoting a modular, reusable, and maintainable user interface.
- **Type-Safe**: Leverages TypeScript and Zod for robust data validation and type safety, from form inputs to API interactions.
- **Static Data & Templates**: Core configuration data (like AI models) and resume templates are loaded from static files (`/src/lib` and `/public`), making them easy to update without code changes.

## 2. Architecture Overview

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
  - `src/lib/models.json`: A list of available Gemini models for the AI enhancement feature.
  - `src/lib/data.ts`: Contains sample data (`testData`) for demonstrating the form.
- **Resume Templates**:
  - HTML templates are stored in `/public/templates/html/`.
  - They are fetched on the client and processed by a lightweight, custom Handlebars-like renderer in `src/lib/template-helpers.ts`.

### AI Integration (Client-Side)

- **AI Logic (`src/app/page.tsx`)**: The `handleEnhanceSubmit` function orchestrates the client-side AI enhancement.
- **API Communication**: The `callGeminiApi` helper function uses the browser's `fetch` API to send requests directly to the Google Gemini API.
- **Security**: The user's Gemini API key is managed in the client's state and is never stored on a server. It is passed directly to the Gemini API with each request.
- **Prompting**: Prompts are constructed as strings on the client, embedding the user's resume data and the target job description.

## 3. Application Flow

1.  **Welcome**: The user starts at a welcome screen and can either begin a new resume or import existing data from a JSON file.
2.  **Template Selection**: The user chooses a visual template for their resume.
3.  **Form Filling**: The user progresses through a multi-step form, entering their contact information, summary, experience, etc.
4.  **Initial Generation**: The user's data is rendered into the selected HTML template to create an initial resume.
5.  **Result Page**: The user can preview the generated resume. From here, they can:
    - **Enhance with AI**: Paste a job description and provide a Gemini API key. The app then performs a client-side API call to get an analysis and an updated resume, which is then displayed.
    - **Edit HTML**: Manually edit the resume's HTML for fine-grained control.
    - **Download/Print**: Export the resume data as JSON or download the final HTML.

## 4. Key Files and Directories

- **`src/app/page.tsx`**: The core of the application logic and UI.
- **`src/app/globals.css`**: Global styles and Tailwind CSS configuration.
- **`src/components/ui/`**: Reusable `shadcn/ui` components.
- **`src/lib/`**: Contains helper functions (`utils.ts`), data schemas (`schema.ts`), static data (`data.ts`, `models.json`), and template helpers (`template-helpers.ts`).
- **`public/templates/html/`**: The raw HTML files for the resume templates.
- **`package.json`**: Defines project dependencies and scripts.
