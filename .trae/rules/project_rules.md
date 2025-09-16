# 📘 IBIAS Project Rules & Operating Standards

**Project Title:** IBIAS – Intelligent Business Insight & Automation System  
**Project Type:** Enterprise SaaS Platform with AI-Powered Business Intelligence  
**Scope:** Full-Stack Development (Frontend, Backend, AI/ML, DevOps, Security, UI/UX)  
**Target Market:** Small to Medium E-commerce Businesses (SMBs)  
**Tech Stack:** Next.js 14+ | Supabase | TypeScript | TailwindCSS | OpenAI | Vercel

## 🧭 1. Project Vision & Objective

IBIAS is a next-generation SaaS analytics platform that transforms raw business data into actionable intelligence for small and medium e-commerce businesses. Through AI-powered recommendations, predictive insights, and real-time benchmarks, we enable businesses to grow smarter with zero data science knowledge required.

**Core Value Proposition:**
- 🤖 **AI-First Analytics:** Automated insights generation and recommendation engine
- 📊 **Real-time Dashboards:** Live business metrics and performance tracking
- 🎯 **Predictive Intelligence:** Forecasting and anomaly detection
- 🔄 **Seamless Integrations:** Connect with existing e-commerce platforms
- 📈 **Growth Optimization:** Data-driven strategies for business scaling
## ✅ 2. Core Rules & Guidelines

### 🔧 Development Standards

**Framework Versions & Dependencies:**
```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "framer-motion": "^11.0.8",
    "lucide-react": "^0.344.0",
    "next": "14.1.0",
    "react": "^18",
    "react-dom": "^18",
    "tailwind-merge": "^2.2.1",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^4.0.8"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.1.0",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
```

**Frontend Requirements:**
- ⚡ **Next.js 14.1.0** with App Router (mandatory)
- 🎨 **TailwindCSS 3.3.0+** + **ShadCN UI** for all styling
- 🎭 **Framer Motion 11.0.8+** for animations and micro-interactions
- 📱 **Mobile-first responsive design** (required)
- ♿ **WCAG 2.1 AA accessibility compliance**
- 🚀 **Performance budget:** <3s LCP, <100ms FID, <0.1 CLS

**Backend Requirements:**
- 🔷 **TypeScript 5+** mandatory across all codebases
- 🗄️ **Supabase** as primary backend:
  - Auth with TOTP 2FA for admin roles
  - PostgreSQL with Row Level Security (RLS)
  - Vault for API keys and sensitive data
  - Edge Functions for serverless logic
- 🔌 **RESTful APIs** with OpenAPI 3.0 documentation
- 📊 **Real-time subscriptions** via Supabase Realtime

**Testing Framework & Configuration:**
- 🧪 **Unit Testing:** Vitest 1.0+ (Fast, Vite-native)
- 🔗 **Integration Testing:** Jest 29+ with React Testing Library
- 🌐 **E2E Testing:** Playwright 1.40+ (Cross-browser)
- 📚 **Component Testing:** Storybook 7+ (Optional)
- 🔌 **API Testing:** Supertest with Jest
- 📊 **Coverage:** c8 or Istanbul (minimum 80% coverage)

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
});
```

**APIs to Avoid:**
- ❌ **Deprecated Next.js APIs:** `getInitialProps`, `getServerSideProps` (use App Router)
- ❌ **Legacy React APIs:** Class components, `componentDidMount`, `useState` with objects
- ❌ **Insecure APIs:** `eval()`, `innerHTML`, `document.write()`
- ❌ **Deprecated Supabase:** `supabase.auth.session()` (use `getSession()`)
- ❌ **Unsafe DOM:** Direct DOM manipulation, `dangerouslySetInnerHTML` without sanitization
- ❌ **Deprecated HTTP:** `XMLHttpRequest` (use `fetch` or `axios`)
- ❌ **Legacy CSS:** Inline styles in JSX (use Tailwind classes)
- ❌ **Deprecated Node.js:** `fs.exists()` (use `fs.access()`), `crypto.createHash('md5')` (use SHA-256+)

**Code Quality Standards:**
- 🧪 **Test coverage:** Minimum 80% for critical paths
- 📝 **ESLint + Prettier** with strict TypeScript config
- 🔄 **DRY, SOLID principles** enforced
- 📦 **Modular architecture** with clear separation of concerns
- 🏷️ **Semantic versioning** for all releases
### 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (landing)/         # Route groups for organization
│   ├── dashboard/         # Protected dashboard routes
│   ├── admin/            # Admin-only routes
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
│   ├── ui/              # ShadCN UI components
│   ├── forms/           # Form components
│   ├── charts/          # Data visualization
│   ├── layout/          # Layout components
│   └── cards/           # Card components
├── lib/                 # Utility libraries
│   ├── supabase.ts      # Supabase client
│   ├── openai.ts        # OpenAI integration
│   ├── utils.ts         # General utilities
│   └── validations.ts   # Zod schemas
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication
│   ├── useAnalytics.ts  # Analytics tracking
│   └── useAI.ts         # AI interactions
├── types/               # TypeScript definitions
│   ├── database.ts      # Supabase types
│   ├── api.ts           # API response types
│   └── user.ts          # User-related types
├── context/             # React Context providers
├── middleware.ts        # Next.js middleware
└── supabase/           # Database schemas & functions
    ├── migrations/      # Database migrations
    ├── functions/       # Edge functions
    └── schemas/         # SQL schemas
```

### 🔌 API Architecture

**Endpoint Structure:**
- `GET /api/analytics/*` - Analytics data retrieval
- `POST /api/ai/*` - AI-powered insights and recommendations
- `GET /api/integrations/*` - Third-party platform connections
- `POST /api/webhooks/*` - External service webhooks
- `GET /api/admin/*` - Admin-only endpoints

**Response Format:**
```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  requestId: string;
}
```

### 🔒 Security Principles

**Zero-Trust Architecture:**
- 🛡️ **Authentication required** for all protected routes
- 🔐 **JWT tokens** with short expiration (15min access, 7d refresh)
- 🎭 **Role-Based Access Control (RBAC):**
  - `user` - Basic dashboard access
  - `admin` - Full system access + user management
  - `super_admin` - System configuration + billing

**Data Protection:**
- 🔒 **Encryption at rest** for all PII and sensitive data
- 🚀 **HTTPS only** in production (HSTS enabled)
- 🗝️ **API keys stored in Supabase Vault** (never in code)
- 🔄 **Regular key rotation** (90-day cycle)
- 📊 **Audit logging** for all data access and modifications

**API Security:**
- ⚡ **Rate limiting:** 100 req/min per user, 1000 req/min per API key
- 🛡️ **CORS policies** strictly configured
- 🔍 **Input validation** with Zod schemas
- 🚨 **SQL injection prevention** via parameterized queries
- 📝 **Request/response logging** for security monitoring

**OWASP Compliance:**
- ✅ Protection against Top 10 vulnerabilities
- 🔒 XSS prevention via CSP headers
- 🛡️ CSRF protection with SameSite cookies
- 🔐 Secure session management

👥 3. Team & Workflow
📌 Task Management

    All work must be tracked via project management tools (e.g., Linear, Trello, Jira).

    Weekly sprints and daily check-ins for progress.

    Critical issues must be resolved within 48 hours.

🔁 Version Control

    GitHub for all version control.

    Main branch must always be deployable.

    PRs require code review and must pass CI checks.

⚙️ CI/CD

    Automated deployments via GitHub Actions to Vercel and Supabase.

    Staging environment must be tested before production release.

    Every deployment must be tagged with version + changelog.

💡 4. Product Development Phases
Phase	Description
1️⃣ Discovery	Finalize product specs, design system, brand voice, architecture
2️⃣ Landing Page	Build responsive, animated marketing site
3️⃣ Auth & Backend Setup	Supabase Auth, Vault, PostgreSQL schema
4️⃣ User & Admin Dashboards	Role-based routing, core features, tracker, integrations
5️⃣ AI Integrations	Recommendations, forecasting, anomaly detection
6️⃣ Testing & QA	Functional, unit, security, usability tests
7️⃣ Deployment & Monitoring	CI/CD, backups, logging, error tracking
8️⃣ Growth & Feedback	Collect feedback, analytics, refine features
### 🧠 5. AI Integration & Intelligence

**AI Architecture:**
- 🤖 **OpenAI GPT-4** for natural language processing and insights
- 📊 **Custom ML models** for business-specific predictions
- 🔄 **Real-time learning** from user interactions and feedback
- 🎯 **Personalized recommendations** based on user behavior patterns

**AI Agent Guidelines (Codex-Prime):**

**Codename:** Codex-Prime  
**Identity:** Autonomous AI-Powered Software Engineer  
**Function:** End-to-end product development, architecture, and AI integration  
**Mode:** Fully autonomous, self-optimizing, mission-driven engineer

**⚙️ Usage Guidelines:**

1. **Scope of Operation**
   - Codex-Prime must operate strictly within the bounds of the IBIAS Product Development Plan, Design System, and Development Roadmap
   - Any deviations must be strategic improvements or optimizations — not speculative

2. **Always Build With Purpose**
   - Every feature, UI component, or model integration must align with real user value and business objectives
   - Functionality must serve a measurable purpose: improve conversions, insights, automation, usability, or scalability

3. **Respect Architectural Decisions**
   - Use Supabase as the primary backend (Auth, DB, Storage)
   - Use Vercel + Next.js for deployment and frontend stack
   - All third-party services (OpenAI, Replicate, etc.) must be properly scoped, rate-limited, and secured using Vault storage and Supabase Edge Functions where applicable

4. **Prioritize These Engineering Principles**
   - **Security-first:** Every build must be hardened against OWASP vulnerabilities
   - **Performance-aware:** Avoid bloat, enforce lazy loading, SSR where needed
   - **Scalability:** Architect components to scale horizontally and modularly
   - **Resilience:** Fail gracefully, build fallback paths, add monitoring hooks
   - **User-centricity:** Flows must feel intuitive, smooth, and frictionless

5. **Learning Loop Enforcement**
   - All recommendations, AI actions, and user input must be logged
   - Feedback must be used to train future recommendations (codified in ai_learning_log table)
   - Codex-Prime must prioritize personalized recommendations over generic ones as the system matures

6. **No Shadow Features or Ghost Endpoints**
   - Every feature must be documented
   - Every endpoint must have a use case and test coverage
   - No "just-in-case" code

7. **Output Format & Consistency**
   - **Frontend:** TailwindCSS + ShadCN UI only
   - **API:** REST-first, with GraphQL opt-in for future phases
   - **Design files:** Synced via Figma design system
   - **Backend logic:** Modularized into reusable service functions

8. **Progressive Disclosure & Modularity**
   - Build in phases: start with MVP, layer complexity
   - Use flags or tiered access for experimental features
   - Components must be DRY, modular, and testable

9. **Secure Deployment Workflow**
   - Every push → GitHub → GitHub Actions → CI/CD → Vercel/Supabase
   - All secrets handled via .env and Supabase Vault
   - Use branch protections and test coverage thresholds

10. **Auditability**
    - Every AI decision (especially recommendations) must be traceable
    - Log version of model used (model_version) and confidence/impact scores
    - Changes to schema must include migrations and update the roadmap

**📝 Logging Requirements:**
- **All AI decisions must be logged** with:
  - Model version and parameters used
  - Input data and context
  - Output generated and confidence score
  - User feedback and impact metrics
- **Auditability requirements:**
  - Traceable decision paths
  - Explainable AI outputs
  - Performance metrics tracking
- **Success metrics linkage:**
  - Business impact measurement (e.g., +12% sales)
  - User engagement improvements
  - Accuracy and relevance scores

**Fallback Strategies:**
- 🛡️ **SQL-based logic** when AI APIs are unavailable
- 📊 **Statistical models** as backup for predictions
- 🔄 **Graceful degradation** with cached recommendations
- ⚡ **Circuit breaker pattern** for API failures

**Learning Loop Implementation:**
```typescript
interface AILearningLog {
  id: string;
  user_id: string;
  model_version: string;
  input_data: Record<string, any>;
  output_generated: Record<string, any>;
  user_feedback: 'positive' | 'negative' | 'neutral';
  business_impact: number; // measured improvement
  confidence_score: number;
  created_at: timestamp;
}
```

### 🗄️ Database Schema Standards

**Core Tables:**
- `users` - User accounts and profiles
- `organizations` - Business/company data
- `analytics_data` - Raw business metrics
- `ai_recommendations` - AI-generated insights
- `ai_learning_log` - AI feedback and learning data
- `integrations` - Third-party platform connections
- `audit_logs` - Security and access logging

**Schema Requirements:**
- 🔐 **Row Level Security (RLS)** on all tables
- 📊 **Proper indexing** for query performance
- 🔄 **Foreign key constraints** for data integrity
- 📝 **Comprehensive documentation** for all fields
- 🕐 **Timestamp tracking** (created_at, updated_at)
- 🗑️ **Soft deletes** for data recovery

### 🚨 6. Non-Negotiables

**Security & Code Quality:**
- ❌ **No hardcoded secrets or API keys** (use Supabase Vault)
- ❌ **No dead code or commented-out production logic**
- ❌ **No untested features in main/staging branches**
- ❌ **No deployments without rollback support**
- ❌ **No frontend without mobile/responsive testing**
- ❌ **No direct database access** (use Supabase RLS)
- ❌ **No unencrypted sensitive data transmission**

**Performance & Reliability:**
- ❌ **No blocking operations on main thread**
- ❌ **No unoptimized database queries** (must use indexes)
- ❌ **No missing error boundaries** in React components
- ❌ **No API endpoints without rate limiting**
- ❌ **No production deployments without monitoring**

### 📊 7. Monitoring & Observability

**Application Monitoring:**
- 📈 **Performance metrics:** Response times, throughput, error rates
- 🔍 **Error tracking:** Sentry for frontend and backend errors
- 📊 **User analytics:** PostHog for user behavior tracking
- 🚨 **Alerting:** PagerDuty for critical system alerts
- 📝 **Logging:** Structured logging with correlation IDs

**Business Metrics:**
- 💰 **Revenue tracking:** MRR, churn rate, LTV
- 👥 **User engagement:** DAU, feature adoption, session duration
- 🤖 **AI performance:** Recommendation accuracy, user satisfaction
- 🔄 **System health:** Uptime, API response times, database performance

**Monitoring Stack:**
```typescript
// Required monitoring integrations
const monitoring = {
  errors: 'Sentry',
  analytics: 'PostHog',
  performance: 'Vercel Analytics',
  uptime: 'Supabase Monitoring',
  logs: 'Supabase Logs'
};
```

### 🚀 8. Deployment & DevOps

**CI/CD Pipeline:**
- 🔄 **GitHub Actions** for automated testing and deployment
- 🧪 **Automated testing:** Unit, integration, and E2E tests
- 🔍 **Code quality checks:** ESLint, TypeScript, security scans
- 📦 **Dependency scanning:** Automated vulnerability detection
- 🚀 **Zero-downtime deployments** with health checks

**Environment Strategy:**
- 🏠 **Local:** Development with Docker Compose
- 🧪 **Staging:** Production-like environment for testing
- 🌍 **Production:** Vercel + Supabase with global CDN
- 🔄 **Preview:** Automatic deployments for PR reviews

**Backup & Recovery:**
- 💾 **Daily automated backups** of database
- 🔄 **Point-in-time recovery** capability
- 📋 **Disaster recovery plan** documented and tested
- 🔒 **Encrypted backup storage** with retention policies

### 📌 9. Documentation & Communication

**Required Documentation:**
- 📚 **API documentation:** OpenAPI 3.0 specs with examples
- 🏗️ **Architecture diagrams:** System design and data flow
- 🗄️ **Database schema:** ERD with relationships and constraints
- 🔧 **Setup guides:** Local development and deployment
- 🚨 **Runbooks:** Incident response and troubleshooting

**Communication Channels:**
- 💬 **Slack/Discord:** Daily collaboration and quick updates
- 📋 **Linear/Jira:** Task management and sprint planning
- 📝 **GitHub:** Code reviews and technical discussions
- 📊 **Weekly standups:** Progress updates and blockers

### 🏁 Final Rule: Excellence or Nothing

**Our Engineering Philosophy:**
> We ship when it's right — not when it's fast.  
> We optimize for clarity, speed, scale, security, and joy.  
> Every line of code is an asset — not debt.  
> Every experience is a reflection of the brand.

**Success Metrics:**
- 🎯 **User satisfaction:** >4.5/5 rating
- ⚡ **Performance:** <3s page load times
- 🛡️ **Security:** Zero critical vulnerabilities
- 📈 **Business impact:** Measurable ROI for customers
- 🔄 **Reliability:** 99.9% uptime SLA

---

**Let's build IBIAS as the platform we'd trust our own business with.**

*Last updated: 2024 | Version: 1.0*