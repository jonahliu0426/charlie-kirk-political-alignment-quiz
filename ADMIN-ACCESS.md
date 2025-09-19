# 🔐 Admin Dashboard Access Guide

## Accessing Participant Statistics

Your Political Alignment Quiz now includes a comprehensive admin dashboard to view participant statistics.

### 🌐 Access URL

**Admin Dashboard:** `https://your-domain.com/admin`

Example: `https://charlie-kirk-political-alignment-quiz.vercel.app/admin`

### 🔑 Authentication

**Default Admin Key:** `admin123`

⚠️ **Important:** Change this in production by setting the `ADMIN_KEY` environment variable.

### 📊 Available Statistics

The admin dashboard provides:

#### **📈 Key Metrics**
- Total number of participants
- Average alignment percentage
- Median alignment score
- Standard deviation

#### **📊 Visual Analytics**
- **Score Distribution Chart** - Bar chart showing participant distribution across 10% buckets
- **Alignment Levels Pie Chart** - Breakdown by alignment categories
- **Score Ranges Table** - Detailed breakdown with percentages

#### **🎯 Detailed Breakdowns**
- **Alignment Levels:**
  - Minimal Alignment (0-24%)
  - Very Low Alignment (25-39%)
  - Low Alignment (40-59%)
  - Moderate Alignment (60-74%)
  - High Alignment (75-89%)
  - Very High Alignment (90-100%)

- **Score Ranges:**
  - Under 25%
  - 25-49%
  - 50-74%
  - 75-89%
  - 90%+

#### **📋 Additional Data**
- Highest and lowest scores achieved
- Recent scores list (up to 50 most recent)
- Real-time data refresh capability
- Timestamp of last update

### 🔒 Security Features

- **Password Protection** - Admin key required for access
- **API Authentication** - All admin endpoints require authentication
- **Error Handling** - Proper error messages for unauthorized access
- **Session Management** - Secure access control

### 🛠 Production Setup

For production deployment:

1. **Set Environment Variable:**
   ```bash
   ADMIN_KEY=your-secure-admin-password-here
   ```

2. **Update in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add `ADMIN_KEY` with your secure password

3. **Alternative Access Methods:**

   **Method 1: URL Parameter**
   ```
   https://your-domain.com/admin
   # Enter your admin key in the login form
   ```

   **Method 2: API Direct Access**
   ```bash
   curl -H "Authorization: Bearer YOUR_ADMIN_KEY" \
        https://your-domain.com/api/admin/stats
   ```

   **Method 3: URL Query**
   ```
   https://your-domain.com/api/admin/stats?key=YOUR_ADMIN_KEY
   ```

### 📱 Mobile Friendly

The admin dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

### 🔄 Real-Time Updates

- Click "🔄 Refresh Data" to get latest statistics
- Data includes timestamp of last update
- All charts and metrics update automatically

### 📊 Export Options

Currently available data can be viewed in the dashboard. For CSV/Excel export functionality, you can:

1. **Use browser dev tools** to copy table data
2. **Screenshot charts** for reports
3. **Access raw JSON data** via API endpoints

### 🚀 Usage Examples

**Typical Use Cases:**
- Monitor quiz engagement and participation
- Analyze political alignment trends
- Generate reports for research or content
- Track viral sharing effectiveness
- Understand audience political demographics

### ⚠️ Important Notes

1. **Data Persistence:** Currently uses in-memory storage (resets on deployment)
2. **Privacy:** All data is anonymous - no personal information collected
3. **Performance:** Dashboard optimized for up to 10,000+ participants
4. **Refresh Rate:** Manual refresh required (no auto-refresh)

### 🔧 Troubleshooting

**Common Issues:**

1. **"Unauthorized" Error**
   - Check your admin key
   - Ensure ADMIN_KEY environment variable is set correctly

2. **"No participants yet"**
   - Normal message when no one has completed the quiz
   - Take the quiz yourself to test the system

3. **Charts not loading**
   - Refresh the page
   - Check browser console for errors
   - Ensure JavaScript is enabled

### 📞 Support

If you need additional analytics features or have questions about the admin dashboard, the code is fully customizable in:

- `/src/app/admin/page.tsx` - Dashboard interface
- `/src/app/api/admin/stats/route.ts` - Statistics API
- `/src/lib/database-serverless.ts` - Data storage layer

---

**Your admin dashboard is ready to use! 🎉**

Access it at: `https://your-domain.com/admin`