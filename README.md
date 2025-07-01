# Global Orion MLM Platform

🚀 **Nigeria's Premier Multi-Level Marketing Platform**

A comprehensive MLM platform built with Next.js, featuring secure user registration, payment processing with Paystack, 6-level matrix commission system, and advanced admin management.

## 🌟 Features

- 🔐 **Secure Authentication & Registration**
- 💳 **Paystack Payment Integration**
- 📊 **6-Level Matrix Commission System**
- 👥 **Advanced Admin Dashboard**
- 📱 **Mobile-First Responsive Design**
- 🔑 **PIN-based Account Activation**
- 📧 **Automated Email Notifications**
- 💰 **Withdrawal Management System**
- 📈 **Real-time Analytics & Reports**
- 🛡️ **Enterprise-Grade Security**

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui Components
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Authentication**: JWT + bcrypt Encryption
- **Payment**: Paystack Integration
- **Email**: Nodemailer with SMTP
- **Deployment**: Vercel Platform
- **Security**: Rate Limiting, Input Validation, CSRF Protection

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Neon PostgreSQL account
- Paystack merchant account
- Gmail account for SMTP

### 1. Clone Repository

\`\`\`bash
git clone https://github.com/Silvertoken1/Globalorion.git
cd Globalorion
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup

\`\`\`bash
cp .env.example .env
\`\`\`

Fill in your environment variables:

\`\`\`env
# Database (Get from Neon Dashboard)
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Admin Credentials (Change these!)
ADMIN_EMAIL="admin@globalorion.com"
ADMIN_PASSWORD="SecureAdmin123!"

# Paystack Keys (Get from Paystack Dashboard)
PAYSTACK_SECRET_KEY="sk_test_your_secret_key"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_your_public_key"

# JWT Secret (Generate a strong random string)
JWT_SECRET="your-super-secure-jwt-secret-key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
\`\`\`

### 4. Database Setup

1. **Create Neon Account**: Visit [neon.tech](https://neon.tech)
2. **Create Project**: New project → Copy connection string
3. **Run SQL Script**: Execute the following in Neon SQL Editor:

\`\`\`sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    member_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    sponsor_id INTEGER REFERENCES users(id),
    upline_id INTEGER REFERENCES users(id),
    location TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    role TEXT NOT NULL DEFAULT 'user',
    activation_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activation_pins table
CREATE TABLE IF NOT EXISTS activation_pins (
    id SERIAL PRIMARY KEY,
    pin_code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'available',
    created_by INTEGER REFERENCES users(id),
    used_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT NOT NULL,
    payment_reference TEXT,
    tracking_number TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    confirmed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create matrix_positions table
CREATE TABLE IF NOT EXISTS matrix_positions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    level INTEGER NOT NULL,
    position INTEGER NOT NULL,
    parent_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create commissions table
CREATE TABLE IF NOT EXISTS commissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    from_user_id INTEGER REFERENCES users(id) NOT NULL,
    amount REAL NOT NULL,
    level INTEGER NOT NULL,
    commission_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    amount REAL NOT NULL,
    bank_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    account_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    processed_by INTEGER REFERENCES users(id),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### 5. Initialize Database

\`\`\`bash
npm run dev
\`\`\`

Visit: `http://localhost:3000/api/init`

### 6. Test the Application

1. **Admin Login**: 
   - URL: `/auth/login`
   - Email: `admin@globalorion.com`
   - Password: `SecureAdmin123!`

2. **User Registration**:
   - URL: `/auth/register`
   - Use Sponsor ID: `GO000001`

3. **Admin Dashboard**: `/admin`

## 🔒 Security Features

- **Password Encryption**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Zod schema validation
- **Rate Limiting**: API endpoint protection
- **CSRF Protection**: Cross-site request forgery prevention
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers

## 📊 Commission Structure

| Level | Commission | Description |
|-------|------------|-------------|
| Level 1 | ₦4,000 | Direct referrals |
| Level 2 | ₦2,000 | Second level |
| Level 3 | ₦2,000 | Third level |
| Level 4 | ₦1,500 | Fourth level |
| Level 5 | ₦1,500 | Fifth level |
| Level 6 | ₦1,500 | Sixth level |

**Total Potential**: ₦12,500 per complete matrix

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**:
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Environment Variables in Vercel**:
   - Copy all variables from `.env`
   - Update `NEXT_PUBLIC_APP_URL` to your domain

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - User management
- `POST /api/admin/generate-pins` - Generate PINs
- `POST /api/admin/approve-commission` - Approve commissions

### Payment
- `POST /api/payment/process` - Process payments
- `POST /api/payment/paystack/initialize` - Initialize payment

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile

## 🛡️ Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Strong Passwords**: Use complex admin passwords
3. **JWT Secrets**: Generate cryptographically secure secrets
4. **Database**: Use connection pooling and SSL
5. **Rate Limiting**: Implement API rate limiting
6. **Input Validation**: Validate all user inputs
7. **HTTPS**: Always use HTTPS in production

## 📞 Support

- **Email**: support@globalorion.com
- **Phone**: +234-800-GLOBAL
- **Documentation**: [docs.globalorion.com](https://docs.globalorion.com)
- **GitHub Issues**: [Create Issue](https://github.com/Silvertoken1/Globalorion/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI Components by [shadcn/ui](https://ui.shadcn.com/)
- Database ORM by [Drizzle](https://orm.drizzle.team/)
- Payment by [Paystack](https://paystack.com/)
- Hosted on [Vercel](https://vercel.com/)

---

**Made with ❤️ in Nigeria 🇳🇬**
