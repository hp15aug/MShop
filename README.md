# AI T-Shirt E-commerce Platform

A modern, AI-powered e-commerce application built with Next.js 16 that allows users to generate, visualize, and save custom t-shirt designs using Google's Imagen 4 technology.

## 🚀 Features

- **AI-Powered Design Generation**: Leverage Google's `imagen-4.0-generate-001` model to create photorealistic t-shirt mockups from text prompts.
- **Real-time Visualization**: Instantly see your designs on high-quality t-shirt models with realistic fabric textures and lighting.
- **Customizable Options**: Choose from different t-shirt colors to match your design.
- **Design Gallery**: Save and browse your generated designs in a personal gallery.
- **Secure Authentication**: Integrated with Supabase for robust user management and data security.
- **Modern UI/UX**: Built with Tailwind CSS v4 for a sleek, responsive, and accessible interface.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript & JavaScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication & Database**: [Supabase](https://supabase.com/)
- **AI Model**: [Google Gemini API](https://ai.google.dev/) (Imagen 4)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📋 Prerequisites

Before you begin, ensure you have the following:

- **Node.js** (v20 or higher recommended)
- **npm** or **yarn**
- A **Supabase** project for authentication and database.
- A **Google Cloud** project with the Generative AI API enabled (for Gemini/Imagen).

## ⚡ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/hp15aug/ecom.git
cd ecom
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your API keys. You can use the provided `env.template` as a reference:

```bash
cp env.template .env.local
```

Update `.env.local` with your actual credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
├── app/                  # Next.js App Router pages and API routes
│   ├── api/generate/     # API route for AI image generation
│   ├── product/          # Product details pages
│   └── page.tsx          # Main landing page
├── components/           # Reusable React components
│   ├── DesignGallery.jsx # Displays saved user designs
│   ├── HeroSection.jsx   # Main interaction area for generating designs
│   └── ...
├── utils/                # Utility functions (Supabase client, etc.)
├── public/               # Static assets
└── ...
```

## 🔌 API Documentation

### POST `/api/generate`

Generates a t-shirt design based on a text prompt.

**Request Body:**
```json
{
  "prompt": "A futuristic cyberpunk city skyline",
  "color": "black"
}
```

**Response:**
```json
{
  "image": "data:image/png;base64,..."
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
