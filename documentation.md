# PPLG 3 VERSE - Project Documentation

This guide provides step-by-step instructions for cloning and setting up the **PPLG 3 VERSE** project on your local machine.

## Prerequisites

Before starting, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

## Cloning the Project

1. Open your terminal (Command Prompt, PowerShell, or any terminal of your choice).
2. Navigate to the directory where you want to store the project.
3. Run the following command:

```bash
git clone https://github.com/FathhJynx/pplg-3-verse.git
```

4. Enter the project directory:

```bash
cd pplg-3-verse
```

## Installation

Install all the required dependencies using npm:

```bash
npm install
```

## Environment Setup

The project uses Supabase for the backend. You need to create a `.env` file in the root directory and add your Supabase credentials.

1. Create a file named `.env` in the root folder.
2. Add the following environment variables (replace with your actual Supabase project keys):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development Commands

### Start Development Server
Runs the app in development mode with hot-module replacement.
```bash
npm run dev
```
The application will usually be available at `http://localhost:8080`.

### Build for Production
Creates an optimized production build in the `dist` folder.
```bash
npm run build
```

### Preview Production Build
Locally preview the production build before deploying.
```bash
npm run preview
```

## Technology Stack
- **Frontend**: React (Vite), TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Animations**: Framer Motion, React Spring
- **3D Graphics**: Three.js (@react-three/fiber, @react-three/drei)
- **Database/Auth**: Supabase
- **Smooth Scrolling**: Lenis

## Deployment

The project is configured for deployment on **Netlify**. You can connect your GitHub repository to Netlify for automatic deployments on every push to the `main` branch.
