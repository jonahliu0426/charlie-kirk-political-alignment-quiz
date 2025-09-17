#!/bin/bash
echo "🚀 Pushing Charlie Kirk Political Alignment Quiz to GitHub..."

# Your GitHub details
username="jonahliu0426"
repo_name="charlie-kirk-political-alignment-quiz"

echo "📡 Adding GitHub remote..."
git remote add origin https://github.com/$username/$repo_name.git

echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Successfully pushed to: https://github.com/$username/$repo_name"
echo ""
echo "🌐 Next steps:"
echo "1. Visit your repository: https://github.com/$username/$repo_name"
echo "2. Deploy to Vercel: https://vercel.com/new/clone?repository-url=https://github.com/$username/$repo_name"
echo "3. Share your live quiz URL with the world! 🎉"