# IBIAS Platform

Intelligent Business Intelligence & Automation System - An AI-powered platform for detecting and eliminating bias in content, decisions, and processes.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, ShadCN UI, Framer Motion
- **Backend**: Next.js API Routes, Supabase Edge Functions
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (RBAC, 2FA)
- **AI Models**: OpenAI GPT-4, Replicate
- **Deployment**: Vercel (Frontend), Supabase (Backend)
- **Testing**: Playwright (E2E), Vitest (Unit)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (landing)/         # Public landing page
│   ├── dashboard/         # User dashboard
│   ├── admin/            # Admin portal
│   ├── login/            # Authentication
│   ├── signup/           # Registration
│   └── api/              # API routes
├── components/           # Reusable UI components
├── lib/                  # Utility functions & API clients
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
├── styles/              # Global styles & Tailwind config
└── supabase/            # Database schemas & functions
```

## 🛠️ Setup Instructions

1. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Environment Variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   REPLICATE_API_TOKEN=your_replicate_token
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Development Phases

### Phase 1: Foundation ✅
- [x] Project structure setup
- [x] Landing page with components
- [x] Authentication pages
- [x] Dashboard and admin layouts
- [x] Basic API routes
- [x] Type definitions
- [x] Testimonials component redesign

### Phase 2: Authentication & Database
- [ ] Supabase integration
- [ ] User authentication flow
- [ ] Database schema setup
- [ ] User profiles and roles

### Phase 3: AI Integration
- [ ] OpenAI API integration
- [ ] Replicate model setup
- [ ] Bias detection algorithms
- [ ] Model performance tracking

### Phase 4: Core Features
- [ ] Bias analysis dashboard
- [ ] Report generation
- [ ] User insights
- [ ] Admin analytics

### Phase 5: Advanced Features
- [ ] Real-time collaboration
- [ ] API webhooks
- [ ] Advanced AI models
- [ ] Performance optimization

### Phase 6: Production
- [ ] Security audit
- [ ] Performance testing
- [ ] CI/CD pipeline
- [ ] Production deployment
- [ ] Demo/Sales video creation
  - [ ] Script writing and storyboard
  - [ ] Screen recordings of key features
  - [ ] Professional video editing
  - [ ] Voice-over and background music
  - [ ] Multiple versions (30s, 60s, 2-3min demo)
  - [ ] Platform optimization (YouTube, LinkedIn, website)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📝 Contributing

1. Create a feature branch
2. Make your changes
3. Add tests if applicable
4. Submit a pull request
