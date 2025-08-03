# Sproutify 🌱

A comprehensive environmental activism platform that empowers activists to host environmental activities and volunteers to join the cause. Built with Next.js, Prisma, and PostgreSQL, Sproutify connects environmental activists with passionate volunteers to create meaningful environmental impact.

![Sproutify](https://images.pexels.com/photos/2547565/pexels-photo-2547565.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## � About Sproutify

Sproutify is more than just an event management platform—it's a movement towards environmental sustainability. We provide a comprehensive ecosystem where environmental activists can organize impactful activities while volunteers can easily discover and participate in causes they care about.

## ✨ Key Features

### For Environmental Activists (Admin Portal)
- **🎯 Event Management**: Create, update, and manage diverse environmental activities including beach cleanups, tree plantations, river restoration, community gardening, and more
- **👥 Volunteer Management**: Comprehensive volunteer tracking with registration management, attendance monitoring, and performance analytics
- **📱 QR Code Technology**: Generate unique QR codes for seamless event check-ins and attendance verification
- **📊 Impact Analytics**: Real-time dashboard with environmental impact metrics, volunteer statistics, and event performance data
- **🏆 Achievement System**: Track volunteer achievements and recognize active community members

### For Environmental Volunteers (Volunteer Portal)
- **🔍 Event Discovery**: Browse and filter upcoming environmental activities by location, date, type, and cause
- **⚡ Quick Registration**: Streamlined registration process for environmental events
- **📋 Personal Dashboard**: Comprehensive overview of registered events, attendance history, and personal environmental impact
- **📱 Mobile-Friendly Check-in**: QR code scanning for easy event attendance confirmation
- **🪙 EcoTokens Rewards**: Earn EcoTokens for participation and redeem them for eco-friendly rewards
- **📈 Impact Tracking**: Monitor your personal contribution to environmental causes
- **🎯 Achievement Badges**: Earn recognition badges for consistent participation and environmental advocacy

## 🌱 Environmental Activities Supported

Sproutify supports a wide range of environmental activities, providing comprehensive guides and management tools for:

- **🏖️ Beach Cleanups**: Coastal conservation and marine debris removal
- **🌳 Tree Plantation**: Reforestation and urban greening initiatives  
- **🌊 River Restoration**: Waterway cleanup and ecosystem restoration
- **🌿 Community Gardening**: Sustainable urban agriculture and food security
- **♻️ Waste Management**: Recycling drives and waste reduction campaigns
- **🦋 Wildlife Conservation**: Habitat restoration and wildlife protection activities
- **🌍 Environmental Education**: Workshops and awareness campaigns

## 🏆 Gamification & Rewards

### EcoTokens System
- **Earn**: Gain EcoTokens for attending events and environmental contributions
- **Redeem**: Exchange tokens for eco-friendly rewards including:
  - Reusable water bottles
  - Plantable seed pencils  
  - Organic tote bags
  - Other sustainable products

### Achievement Badges
- **🌟 New Volunteer**: Welcome badge for joining the platform
- **📝 Registered**: Badge for event registrations
- **💚 Active Volunteer**: Earned after attending 5+ events
- **🏆 Champion**: Elite status for 10+ event participation
- **⭐ Reliable**: Recognition for 80%+ attendance rate

## 📚 Resource Library

Sproutify includes comprehensive guides for organizing environmental activities:
- Step-by-step preparation guides
- Safety measures and protocols
- Best practices for environmental activities
- Post-event impact measurement
- Community engagement strategies

## � Tech Stack

- **Frontend**: Next.js 14+ with App Router, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM  
- **Database**: PostgreSQL
- **Authentication**: JWT with bcrypt password hashing
- **UI Framework**: Radix UI components with Tailwind CSS styling
- **Icons**: Lucide React and FontAwesome
- **Animations**: Framer Motion for smooth interactions
- **QR Technology**: QR code generation and scanning functionality
- **State Management**: React hooks and local storage
- **Styling**: Custom gradients and responsive design

## �📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

## 🛠️ Installation

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sproutify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the `.env.example` file to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   
   Update the following variables in `.env`:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/sproutify"
   
   # JWT Secret (use a strong, random string)
   JWT_SECRET="your-super-secret-jwt-key-here"
   
   # Base URL
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 🗄️ Database Schema

The application uses the following main entities:

- **User**: Stores user information for both activists (admins) and volunteers with role-based access
- **Event**: Environmental activity events with comprehensive details including type, location, safety instructions, and impact metrics  
- **EventRegistration**: Tracks volunteer registrations for environmental activities
- **Attendance**: Records actual participation via QR code check-ins and awards EcoTokens
- **EcoTokens**: Gamification system tracking earned tokens for environmental contributions

## 🔐 Authentication & Authorization

- **JWT-based authentication** with secure token storage and session management
- **Role-based access control** with two distinct user roles:
  - **ADMIN**: Environmental activists who create and manage events
  - **VOLUNTEER**: Community members who participate in environmental activities
- **Protected routes** with comprehensive authentication guards
- **Password security** using bcrypt hashing with salt rounds
- **Token-based API authentication** for secure data access

## 🎨 UI/UX Features

- **🌍 Environmental Theme**: Nature-inspired color palette with teal and green gradients
- **📱 Responsive Design**: Optimized for mobile, tablet, and desktop experiences
- **⚡ Modern Interface**: Clean, intuitive design with smooth animations using Framer Motion
- **🎯 Accessibility**: WCAG compliant with proper focus management and screen reader support
- **🔄 Loading States**: Comprehensive loading indicators and error handling
- **🎨 Component Library**: Custom Radix UI components with consistent styling
- **📊 Data Visualization**: Interactive charts and progress indicators for impact tracking

## 🧪 Development

### Running in Development Mode
```bash
npm run dev
```

### Database Management
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate new migration
npx prisma migrate dev --name migration_name
```

### Build for Production
```bash
npm run build
npm run start
```

## 🌟 Environmental Impact

Sproutify has facilitated:
- **1,150+ beaches cleaned** across various coastal regions
- **200,000+ trees planted** through reforestation initiatives  
- **15,000+ volunteers engaged** in environmental activities
- **5,000+ pounds of waste collected** and properly disposed
- **Countless lives inspired** to take environmental action

## 🤝 Contributing

We welcome contributions to make Sproutify even better! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 🌟 Acknowledgments

- Built with [Next.js](https://nextjs.org/) - The React Framework for Production
- Database management with [Prisma](https://prisma.io/) - Next-generation ORM
- UI components styled with [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- Component library from [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- Icons from [Lucide React](https://lucide.dev/) and [FontAwesome](https://fontawesome.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Images from [Pexels](https://pexels.com/) - Free stock photos

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with � for a sustainable future and cleaner environment**

*Join the Sproutify movement today and be part of the change our planet needs!*