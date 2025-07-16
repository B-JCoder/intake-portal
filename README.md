# SaaS Client Intake Platform

A complete, fully functional SaaS client intake platform built with Next.js, Clerk authentication, Prisma, and Stripe payments.

## 🚀 Features

### ✅ Authentication (Clerk)
- User signup/login with Clerk
- Role-based access (USER/ADMIN)
- Protected routes with middleware
- User data stored in PostgreSQL

### ✅ Multi-Step Intake Form
- 4-step project submission form
- Real-time cost estimation
- Form validation with Zod
- Data persistence to database

### ✅ Payment Integration (Stripe)
- Secure Stripe Checkout
- Full payment or 50% deposit options
- Webhook handling for payment status
- Payment tracking in database

### ✅ User Dashboard
- View all submitted projects
- Track project status and payments
- Delete projects
- Real-time data updates

### ✅ Admin Panel
- View all client projects
- Update project status
- Delete any project
- Revenue and project analytics

### ✅ Database Integration
- PostgreSQL with Prisma ORM
- Full CRUD operations
- Relational data models
- Real-time updates

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Clerk
- **Database**: PostgreSQL + Prisma ORM
- **Payments**: Stripe
- **UI**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod
- **TypeScript**: Full type safety

## 📦 Installation

1. **Clone and install dependencies:**
\`\`\`bash
git clone <repo-url>
cd saas-intake-platform
npm install
\`\`\`

2. **Set up environment variables:**
\`\`\`bash
cp .env.example .env
\`\`\`

Fill in your environment variables:
- Clerk keys from your Clerk dashboard
- PostgreSQL database URL (Neon compatible)
- Stripe keys from your Stripe dashboard

3. **Set up the database:**
\`\`\`bash
npx prisma db push
npx prisma generate
\`\`\`

4. **Run the development server:**
\`\`\`bash
npm run dev
\`\`\`

## 🔧 Environment Variables

\`\`\`env
# Clerk Authentication
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key

# Database
DATABASE_URL=your-postgres-url

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## 📊 Database Schema

### User Model
- Stores Clerk user information
- Role-based access control
- Links to project submissions

### ProjectForm Model
- Complete project requirements
- Status tracking (DRAFT → SUBMITTED → IN_PROGRESS → COMPLETED)
- Feature arrays and cost estimation

### Payment Model
- Stripe payment integration
- Payment status tracking
- Support for full/deposit payments

## 🔗 API Routes

- `POST /api/projects` - Create new project
- `GET /api/projects` - Get user projects
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project status
- `DELETE /api/projects/[id]` - Delete project
- `POST /api/create-payment-intent` - Create Stripe session
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

## 🎯 Key Features

### Real-time Cost Calculator
- Dynamic pricing based on features and pages
- Website type multipliers
- Live updates as user selects options

### Secure Payment Processing
- Stripe Checkout integration
- Webhook handling for status updates
- Payment confirmation and tracking

### Admin Management
- Complete project oversight
- Status management
- Revenue analytics
- Client communication tools

### User Experience
- Responsive design
- Loading states and error handling
- Toast notifications
- Intuitive navigation

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Database Setup
- Use Neon, Supabase, or any PostgreSQL provider
- Run `npx prisma db push` after deployment
- Set up Stripe webhooks pointing to your domain

## 🔒 Security Features

- Protected API routes with Clerk authentication
- Role-based access control
- Input validation with Zod
- Secure payment processing with Stripe
- CSRF protection with middleware

## 📱 Pages

- `/` - Landing page
- `/submit` - Multi-step project form
- `/dashboard` - User project dashboard
- `/admin` - Admin management panel
- `/payment` - Stripe payment processing
- `/thank-you` - Payment confirmation

## 🧪 Testing

All features are fully functional and testable:
- Create user accounts with Clerk
- Submit projects through the form
- Process payments with Stripe (test mode)
- Manage projects in dashboard
- Admin panel for project oversight

## 📞 Support

For issues or questions:
1. Check the GitHub issues
2. Review the documentation
3. Contact support team

## 📄 License

MIT License - see LICENSE file for details.
