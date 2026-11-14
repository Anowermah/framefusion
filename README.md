# FrameFusion 🎨 ("Create. Customize. Celebrate.")

A complete, production-ready visual campaign and photo framing platform inspired by Twibbonize, built with **Laravel 12**, **Inertia.js**, **React 18**, **TypeScript**, **Tailwind CSS**, and high-resolution **HTML5 Canvas**.

---

## 🌟 Highlights & Key Features

### 1. High-Performance Photo Studio (Core Feature)
- **Layer 1**: User photo underneath (pan, zoom 0.2x-3x, rotate -180° to +180°).
- **Layer 2**: Official Transparent PNG Campaign Frame overlay on top, maintaining pure pixel transparency.
- **Image Adjustments**: Real-time filters for Brightness, Contrast, Saturation, Grayscale, and Sepia.
- **Multi-Ratio Framing**:
  - **1:1 Square** (1080 × 1080 px) - Avatars and profile pictures.
  - **4:5 Portrait** (1080 × 1350 px) - Instagram & Facebook feed posts.
  - **9:16 Story** (1080 × 1920 px) - Fullscreen Stories & Status.
- **Export Options**: PNG (with transparency), JPEG, and WebP at Standard (1080px) and Ultra HD 2X (2160px).
- **Instant Client-Side Compositing**: Zero server latency for rendering; automatic download trigger with clean filename (`framefusion-[campaign-slug].png`) and confetti celebration!

### 2. Multi-Step Campaign Creation Wizard
- **Step 1**: Campaign Type (Frame Twibbon with transparent cutout vs. Background Twibbon).
- **Step 2**: Drag & drop transparent PNG/WebP frame upload with live thumbnail preview and dimension validation.
- **Step 3**: Metadata, title, auto-slug generator, category assignment, tags, and bilingual descriptions.
- **Step 4**: Photo placement configuration (default zoom, canvas aspect ratio).
- **Step 5**: Interactive test preview.
- **Step 6**: Instant publishing or draft saving.

### 3. Complete Dual-Language Support (English & Bengali)
- Instant client-side & server-side toggle between **English** and **বাংলা (Bengali)**.
- Tailored typography with Google Fonts: **Inter** and **Hind Siliguri**.
- Every single button, navigation item, modal, editor control, and card is bilingual.

### 4. Discovery & Community
- **Homepage**: Hero with live sample collage, fast search bar with category filter, trending campaigns, featured campaigns, and step-by-step how it works guide.
- **Explore Directory**: Search by campaign name, tag, or creator with sorting (Trending, Most Supported, Newest, Oldest, Featured).
- **Campaign Details Page**: Supporter counter, share to Facebook, WhatsApp, X (Twitter), native Web Share API, bookmarking, and moderation report system.
- **Supporter Gallery**: Public community wall showcasing photos shared by supporters.

### 5. Dashboards
- **User Dashboard**: Overview metrics (Total Campaigns, Supporters, Generated Photos, Saved Campaigns), My Campaigns management (Publish/Draft toggle, Delete), Photo Generation History, and Saved Campaigns.
- **Admin Dashboard**: System Overview, User Management (Role assignment: User/Creator/Admin, Suspend/Activate), Campaign Moderation (Feature/Trending toggle, Delete), Category Manager, Moderation Reports, Website Branding Settings, and Engagement Analytics.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Laravel 12 (PHP 8.4+), Eloquent ORM, SQLite / MySQL / PostgreSQL |
| **Frontend** | React 18, TypeScript, Inertia.js, Tailwind CSS, Lucide Icons |
| **Compositor** | HTML5 Canvas 2D API, Drag & Drop File API, Blob Export |
| **Animations** | Canvas Confetti, Tailwind Transition Animations |
| **Build Tool** | Vite 6 + Laravel Vite Plugin |

---

## 🚀 Getting Started

### Prerequisites
- PHP >= 8.2 with `gd`, `sqlite3`, `mbstring`, `fileinfo` extensions enabled
- Composer >= 2.0
- Node.js >= 18.0 and npm

### Installation Steps

1. **Clone or Navigate to the Project:**
   ```bash
   cd "d:\Web Design\Ai website\Campain"
   ```

2. **Install Composer & NPM Dependencies:**
   ```bash
   composer install
   npm install
   ```

3. **Configure Environment:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Run Migrations & Seed Sample Transparent Frames:**
   ```bash
   php artisan migrate --seed
   ```
   *This automatically generates 6 realistic transparent PNG campaign frames (Independence Day, University Convocation, Tech Summit, Earth Hour, Football Champions, Eid Mubarak) into `public/storage/frames`.*

5. **Create Storage Link:**
   ```bash
   php artisan storage:link
   ```

6. **Build Frontend Assets:**
   ```bash
   npm run build
   ```

7. **Start the Application:**
   ```bash
   php artisan serve
   ```
   Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your web browser.

---

## 🔑 Pre-Seeded Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@framefusion.com` | `password123` |
| **Creator** | `creator@framefusion.com` | `password123` |
| **Standard User** | `user@framefusion.com` | `password123` |

---

## 📂 Project Structure

```
├── app/
│   ├── Http/Controllers/
│   │   ├── AdminController.php         # Admin moderation & platform settings
│   │   ├── CampaignController.php      # Explore, details, photo editor, generation
│   │   ├── DashboardController.php     # User campaign & download management
│   │   ├── HomeController.php          # Homepage data & featured curation
│   │   └── StaticPageController.php    # About, Contact, Privacy, Terms, Guide
│   ├── Models/                         # Eloquent Models (Campaign, Category, etc.)
│   └── Services/
│       └── FrameGeneratorService.php   # GD-powered transparent frame generator
├── database/
│   ├── migrations/                     # Complete relational database schema
│   └── seeders/DatabaseSeeder.php      # Initial categories, users, and campaigns
├── resources/
│   ├── css/app.css                     # Tailwind CSS v3/v4 design tokens
│   ├── js/
│   │   ├── Components/
│   │   │   ├── ApplicationLogo.tsx     # Vector FrameFusion logo
│   │   │   ├── CampaignCard.tsx        # Responsive campaign preview card
│   │   │   ├── CampaignWizard.tsx      # 6-step campaign creator wizard
│   │   │   ├── PhotoEditor.tsx         # Core Canvas interactive editor
│   │   │   ├── Navbar.tsx & Footer.tsx # Header & footer navigation
│   │   │   └── AdminNav.tsx            # Admin sub-navigation
│   │   ├── Context/LanguageContext.tsx # Dual-language English/Bengali provider
│   │   ├── Pages/                      # Inertia React page components
│   │   └── lib/translations.ts         # English and Bengali dictionary
└── tests/
    └── Feature/FrameFusionPlatformTest.php # Comprehensive test suite
```

---

## 🛡️ License & Acknowledgements
Built as a modern, high-performance visual campaign SaaS platform for creators, universities, and social movements.
