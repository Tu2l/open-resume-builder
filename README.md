# Resume AI

Resume AI is a modern, web-based application designed to help users create, manage, and enhance their resumes with the power of generative AI. Built with Next.js and leveraging the Google Gemini API, this tool provides a seamless, client-side experience for crafting professional resumes tailored to specific job descriptions.

## Core Features

- **Multi-Step Resume Builder**: An intuitive, multi-step form guides users through creating a comprehensive resume, section by section.
- **Template Selection**: Choose from multiple professional templates (Classic, Modern, Creative) to instantly style your resume.
- **AI-Powered Enhancement**: Paste a job description and provide a Google Gemini API key to have the AI rewrite your resume, highlighting relevant skills and experience.
- **Client-Side Processing**: All AI analysis and generation happen directly in your browser. Your resume data and API key are never sent to our server, ensuring privacy and security.
- **Live Preview & Editing**: Instantly preview your generated resume. For advanced control, you can directly edit the resume's HTML.
- **Import/Export**: Save your resume data to a JSON file and import it later to continue your session.
- **Download & Print**: Download your final resume as a clean HTML file, which can be easily printed to PDF from your browser.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15 (with App Router)
- **UI**: [React](https://reactjs.org/) 18
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Schema Validation**: [Zod](https://zod.dev/)
- **AI**: [Google Gemini API](https://ai.google.dev/) (used client-side)

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd resume-ai
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To run the application locally, use the following command:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## How It Works

The application operates entirely on the client side. When you provide your resume data and a job description for enhancement, the application constructs a prompt and sends it directly to the Google Gemini API from your browser. The API's response is then used to update the resume content in real-time. This architecture ensures that your sensitive information remains private.

To use the AI enhancement feature, you will need to obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Template Management

The application includes a comprehensive template management system with automation scripts located in the `scripts/` directory:

```bash
# Add new templates
./scripts/add-template.sh luxury "Luxury Executive" "Premium design" professional "Luxury,Premium"

# Discover unconfigured templates  
./scripts/discover-templates.sh

# Validate system integrity
./scripts/validate-templates.sh

# Remove templates safely
./scripts/remove-template.sh luxury
```

For complete template documentation, see [`docs/TEMPLATE_SYSTEM.md`](docs/TEMPLATE_SYSTEM.md).
