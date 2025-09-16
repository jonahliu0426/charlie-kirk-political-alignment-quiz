# Political Alignment Quiz - Deployment Guide

## Quick Deployment to Vercel (Recommended)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Create a Vercel account**: Go to [vercel.com](https://vercel.com) and sign up
2. **Import your project**: 
   - Click "New Project" 
   - Import from Git Repository
   - Connect your GitHub account if needed
   - Upload this project folder or create a GitHub repo
3. **Configure deployment**:
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
4. **Deploy**: Click "Deploy" - you'll get a public HTTPS URL immediately

### Option 2: Deploy via CLI

1. **Install Vercel CLI**: 
   ```bash
   npm install -g vercel
   # or use npx: npx vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Follow prompts**:
   - Set up and deploy: Yes
   - Which scope: (select your account)
   - Link to existing project: No
   - Project name: political-alignment-quiz (or your choice)
   - Directory: `./` (default)

### Option 3: GitHub Integration (Automatic Deployments)

1. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/political-alignment-quiz.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to vercel.com dashboard
   - Click "Import Project" 
   - Select your GitHub repository
   - Deploy automatically

## Alternative Deployment Options

### Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your `out` folder (after running `npm run build`)
3. Get instant HTTPS URL

### Railway
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Deploy with automatic HTTPS

## Environment Notes

- **Database**: Currently uses SQLite which works fine for small-scale deployment
- **Storage**: User responses are stored locally in the SQLite database
- **Scaling**: For high traffic, consider upgrading to PostgreSQL or similar

## Post-Deployment

After deployment, you'll receive a URL like:
- `https://your-project-name.vercel.app`
- `https://your-project-name-git-main-username.vercel.app`

Your political alignment quiz will be fully functional with:
- ✅ 10 political questions with custom choices
- ✅ Real-time progress tracking
- ✅ Results with alignment percentage
- ✅ Distribution chart comparing to other users
- ✅ Responsive design for mobile and desktop
- ✅ Secure HTTPS encryption

## Troubleshooting

If you encounter issues:
1. Check the build logs in your deployment platform
2. Ensure all dependencies are in `package.json`
3. Verify the build completes successfully locally: `npm run build`
4. Check that API routes are working in production

## Features Included

- Interactive quiz with 10 political questions
- Horizontal choice layout with color-coded responses
- SQLite database for storing user responses
- Results page with percentage alignment
- Distribution chart showing user position
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Next.js 15 with App Router