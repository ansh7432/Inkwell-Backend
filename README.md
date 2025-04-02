# InkWell - Storytelling Platform

![image](https://github.com/user-attachments/assets/21435eba-2c41-4db7-a9b3-dc51b8dd5c8d)


## Overview
Inkwell is an elegant storytelling platform that provides writers with a premium space to create, publish, and share their stories. Built with modern web technologies and designed with a focus on luxury aesthetics, StoryBlog offers a sophisticated experience for both writers and readers.

## Features
- **Elegant User Interface**: Carefully crafted design with attention to detail
- **Responsive Design**: Beautiful experience across all devices and screen sizes
- **Dark/Light Mode**: Seamlessly switch between elegant light and dark themes
- **User Authentication**: Secure account creation and login system
- **Story Creation**: Rich text editor for crafting beautiful stories
- **Story Discovery**: Curated feed of premium stories from talented writers
- **User Profiles**: Custom profiles for writers to showcase their work
- **Interactive Elements**: Micro-animations and smooth transitions throughout

## Technology Stack
- **Frontend**: React.js with TypeScript
- **Styling**: Tailwind CSS with custom luxury theme
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Hosting**: Netlify

## Getting Started

### Prerequisites
Make sure you have the following installed:
- **Node.js** (v14+ recommended)
- **npm** or **yarn**
- **Git**

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ansh7432/Inkwell-Backend
   ```

2. Install dependencies:
   ```bash
   npm install  # or yarn install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add necessary environment variables (e.g., Supabase credentials)
  ``` VITE_SUPABASE_URL=your_supabase_url VITE_SUPABASE_ANON_KEY=your_supabase_anon_key ```

4. Start the development server:
   ```bash
   npm run dev  # or yarn dev
   ```

5. Open your browser and navigate to: [http://localhost:5173](http://localhost:5173)

## Project Structure
```
inkwell-backend/
├── public/             # Public assets
├── src/                
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (auth, theme)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Library code, utilities
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and theme
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation

```

## Design Philosophy
StoryBlog embraces a luxury aesthetic characterized by:
- **Sophisticated Typography**: Elegant serif fonts for headings with modern sans-serif for body text
- **Premium Color Palette**: Rich gradients with sophisticated primary and accent colors
- **Subtle Animations**: Tasteful micro-interactions that enhance the user experience
- **Thoughtful Spacing**: Generous whitespace for improved readability and visual hierarchy
- **Attention to Detail**: Fine borders, shadows, and state changes for interactive elements


## Acknowledgments
- **Tailwind CSS** - For the utility-first CSS framework
- **Supabase** - For database and authentication
- **React** - For the UI library
- **Lucide Icons** - For beautiful icons
- **Inter & Merriweather Fonts** - For typography

Created with ❤️ for storytellers everywhere.
