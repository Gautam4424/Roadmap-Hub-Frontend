# SkillForge 🔥

> A modern, interactive learning roadmap platform that helps users follow structured learning paths, access curated free resources, and track their progress globally.

---

## ✨ Features

- **Auth-Powered Experience** — Secure user accounts with **FastAPI JWT** integration.
- **Data Isolation** — Your progress is yours. Track completion across devices with a unified learning journey.
- **Curated Roadmaps** — Structured learning paths for AI/ML, Python Development, Data Structures & Algorithms, and more
- **Interactive Curriculum** — Expandable chapters with detailed subtopics (book-index style)
- **Free Resources** — Links to videos, articles, courses, and documentation for every topic
- **Progress Persistence** — Mark chapters as complete and see your progress with visual progress bars powered by a real backend.
- **Smart Filters** — Search, filter by category (Tech, Design, Management, Data Science), and difficulty level
- **User Dashboard** — View completed topics, hours invested, and per-roadmap progress in real-time.

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 + Vite |
| **Styling** | TailwindCSS 4 |
| **Auth Backend** | FastAPI (Microservices Architecture) |
| **Database** | PostgreSQL (User Sessions & Progress) |
| **Routing** | React Router v7 |
| **Icons** | Lucide React |
| **Animations** | Motion (Framer Motion) |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [Roadmap-Hub Auth Service](https://github.com/Gautam4424/Roadmap-Hub-auth-service) (Running on port 8001)

### Installation

```bash
# Clone the repository
git clone https://github.com/Gautam4424/SkillForge.git

# Navigate to the project
cd SkillForge

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Important Note
For real authentication to work, make sure the **Auth Service** is running on your machine or reachable via the base URL configured in `src/app/utils/authStorage.ts`.

## 📁 Project Structure

```
SkillForge/
├── src/
│   ├── app/
│   │   ├── App.tsx             # Router & Context provider
│   │   ├── routes.tsx          # Route definitions
│   │   ├── context/
│   │   │   └── AuthContext.tsx # React Context for Auth state
│   │   ├── pages/
│   │   │   ├── Home.tsx        # Landing & Grid
│   │   │   ├── Login.tsx       # Auth integration
│   │   │   └── Profile.tsx     # Progress Dashboard
│   │   ├── data/
│   │   │   └── roadmaps.ts     # Roadmap definitions
│   │   └── utils/
│   │       ├── authStorage.ts  # Real API Auth integration
│   │       └── progressStorage.ts # Data isolated progress tracking
│   └── styles/                 # Global UI themes
├── package.json
└── vite.config.ts
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ by [Gautam Sachdeva](https://github.com/Gautam4424)**