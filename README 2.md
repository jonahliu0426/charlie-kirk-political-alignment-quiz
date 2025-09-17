# Political Alignment Quiz

A Next.js web application that allows users to take a 10-question political quiz and see how their views align with reference positions. Users can view their alignment percentage and see how they compare to other participants through an interactive distribution chart.

## 🌟 Features

- **10 Political Questions** with neutrally-phrased, single-sentence questions
- **Custom Answer Choices** specific to each question's topic
- **Horizontal Choice Layout** with color-coded political spectrum (red → gray → green)
- **Real-time Progress Tracking** during the quiz
- **Alignment Percentage** calculation compared to reference positions
- **Distribution Chart** showing where you stand compared to other users
- **Responsive Design** optimized for mobile and desktop
- **SQLite Database** for storing anonymous user responses
- **Secure HTTPS Deployment** ready for production

## 🚀 Live Demo

[Deploy this project to see it live!](https://vercel.com/new/clone?repository-url=https://github.com/jonahliu0426/charlie-kirk-political-alignment-quiz)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **Charts**: Chart.js with react-chartjs-2
- **Deployment**: Vercel-ready

## 📋 Quiz Questions

The quiz covers 10 key political topics with neutrally-phrased questions:

1. Government regulation of business
2. Immigration policy
3. Environment vs. economic growth
4. Tax structure across income levels
5. Individual reproductive choices
6. Government role in healthcare
7. Firearms and public safety balance
8. Marriage laws and definitions
9. Minimum wage policies
10. International military engagement

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jonahliu0426/charlie-kirk-political-alignment-quiz.git
   cd charlie-kirk-political-alignment-quiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create the database directory**
   ```bash
   mkdir -p data
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jonahliu0426/charlie-kirk-political-alignment-quiz)

**Or manually:**

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npx vercel --prod
   ```

### Alternative Deployment Options

- **Netlify**: Drag and drop the build output
- **Railway**: Connect your GitHub repository
- **DigitalOcean**: Use their App Platform

## 📊 How It Works

1. **User takes quiz**: 10 questions with 5 choices each
2. **Responses stored**: Anonymous data saved in SQLite database
3. **Alignment calculated**: Compare user answers to reference positions
4. **Results displayed**: Show percentage alignment and distribution chart
5. **Data aggregated**: All responses contribute to the distribution visualization

## 🎨 Color Scheme

The interface uses an intuitive political spectrum color scheme:
- **Red** (positions 1-2): More conservative/restrictive options
- **Gray** (position 3): Moderate/neutral options  
- **Green** (positions 4-5): More progressive/expansive options

## 🔧 Configuration

### Question Customization

Edit `src/data/questions.ts` to:
- Modify questions and answer choices
- Adjust reference positions
- Add or remove questions

### Styling

- **Colors**: Modify Tailwind classes in components
- **Layout**: Adjust responsive breakpoints in Tailwind config
- **Charts**: Customize Chart.js options in `Results.tsx`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API endpoints
│   │   ├── submit/        # Handle quiz submissions
│   │   ├── results/       # Get individual results
│   │   └── distribution/  # Get aggregate statistics
│   ├── results/           # Results pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── Flashcard.tsx     # Individual question cards
│   ├── Quiz.tsx          # Main quiz interface
│   └── Results.tsx       # Results with charts
├── data/                 # Static data
│   └── questions.ts      # Quiz questions and choices
└── lib/                  # Utilities
    ├── database.ts       # SQLite operations
    └── utils.ts          # Helper functions
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Charts powered by [Chart.js](https://www.chartjs.org/)
- Deployed on [Vercel](https://vercel.com/)

---

**Note**: This quiz is designed for educational purposes to help users understand political alignment. All responses are collected anonymously for statistical analysis only.