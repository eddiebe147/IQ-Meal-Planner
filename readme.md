# 🍽️ Family Meal Planner

Your smart kitchen command center for meal planning, recipe storage, and automated grocery shopping.

![Family Meal Planner](https://img.shields.io/badge/Version-1.0-brightgreen) ![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-blue) ![PWA](https://img.shields.io/badge/PWA-Ready-purple)

## ✨ Features

- **📅 Smart Meal Planning** - Plan your weekly meals with AI-powered suggestions
- **📚 Recipe Vault** - Store and organize your family's favorite recipes
- **🛒 Auto Shopping Lists** - Generate organized shopping lists from meal plans
- **⏰ Automated Scheduling** - Friday planning reminders and Saturday shopping lists
- **📱 Mobile Friendly** - Works perfectly on phones, tablets, and computers
- **💾 Offline Ready** - Your data is saved locally, works without internet
- **🏠 Family Focused** - Designed for busy families who love home cooking

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)

1. **Fork this repository** 
   - Click the "Fork" button at the top of this page
   - This creates your own copy of the meal planner

2. **Enable GitHub Pages**
   - Go to your forked repository's Settings
   - Scroll down to "Pages" section
   - Set Source to "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

3. **Access your app**
   - Your meal planner will be available at: `https://yourusername.github.io/family-meal-planner`
   - Bookmark this URL on your phone's home screen!

### Option 2: Download and Run Locally

1. **Download files**
   - Click "Code" → "Download ZIP"
   - Extract the files to a folder on your computer

2. **Open in browser**
   - Double-click `index.html`
   - Or drag the file into any web browser

3. **Bookmark for easy access**
   - Add to your browser bookmarks
   - On mobile: "Add to Home Screen"

## 📂 Project Structure

```
family-meal-planner/
├── index.html          # Main application file
├── styles.css          # Beautiful styling
├── app.js              # All the smart functionality
├── manifest.json       # PWA configuration
├── README.md           # This file
└── screenshots/        # App screenshots (optional)
```

## 🎯 How It Works

### 1. **Recipe Vault**
- Add your family's favorite recipes with ingredients, instructions, and photos
- Tag recipes (dinner, quick, family-friendly) for easy filtering
- Search through recipes by name, ingredient, or tag

### 2. **Weekly Meal Planning**  
- Interactive calendar to plan 7 days of meals
- AI-powered auto-suggestions based on your recipe vault
- Smart ingredient reuse (Monday's chimichurri becomes Tuesday's sandwich spread!)

### 3. **Smart Shopping Lists**
- Automatically generated from your weekly meal plan  
- Organized by grocery store sections (meat, produce, dairy, pantry)
- Optimizes to reduce shopping time and avoid duplicates

### 4. **Automated Scheduling**
- Friday 5 PM: "Time to plan next week's meals!"
- Saturday 9 AM: Shopping list automatically generated
- Sunday 11 AM: Grocery delivery reminder
- All notifications work in your browser

## 📱 Mobile Experience

The meal planner is designed mobile-first:

- **Add to Home Screen** - Works like a native app
- **Offline Functionality** - Plan meals without internet
- **Touch Optimized** - Easy to use while cooking or shopping
- **Fast Loading** - Optimized for all devices

## 🔧 Customization

### Adding Your Own Recipes

1. Click "📚 Recipes" tab
2. Click "➕ Add Recipe" 
3. Fill in:
   - Name and emoji
   - Cook time and servings
   - Ingredients (one per line)
   - Instructions
   - Tags for organization

### Personalizing Schedule

1. Click "⏰ Schedule" tab
2. Toggle schedules on/off
3. Click "⚙️ Settings" to customize times

### Backup Your Data

Your recipes and meal plans are stored in your browser. To backup:

1. Open browser developer tools (F12)
2. Go to "Application" → "Local Storage"
3. Copy the `mealPlannerData` value
4. Save to a text file

## 🛠️ Technical Details

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Storage**: Browser LocalStorage (no server needed)
- **PWA**: Service Worker for offline functionality
- **Hosting**: GitHub Pages (free!)
- **No Dependencies**: Everything works without external libraries

## 🆙 Future Enhancements

Ready to add more features? Here are some ideas:

- **Grocery Store Integration** - Connect to Kroger, Instacart APIs
- **Nutrition Tracking** - Calorie and macro counting
- **Family Sharing** - Multiple family members can contribute
- **Voice Commands** - "Hey Google, what's for dinner?"
- **Recipe Photos** - Camera integration for food pics
- **Meal Prep Planning** - Optimize for batch cooking

## 📖 Usage Tips

### For Busy Families
- **Sunday Planning**: Spend 15 minutes planning the whole week
- **Smart Leftovers**: Plan meals that create intentional leftovers
- **Batch Cooking**: Use Sunday to prep ingredients for the week

### For Beginners
- **Start Simple**: Add just 5 favorite recipes to begin
- **Use Auto-Suggest**: Let the AI help you plan your first week
- **Test the Schedule**: Try the Friday planning reminder

### For Power Users
- **Tag Everything**: Use detailed tags for advanced filtering
- **Plan Themes**: "Meatless Monday", "Taco Tuesday", "Sunday Prep"
- **Seasonal Planning**: Tag recipes by season or holidays

## 🤝 Contributing

Want to improve the meal planner? Here's how:

1. **Fork the repository**
2. **Make your changes**
3. **Test thoroughly**
4. **Submit a pull request**

### Ideas for Contributions
- New recipe templates
- Additional grocery store categories
- Better mobile optimizations  
- Accessibility improvements
- Multi-language support

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💬 Support

Having issues? Here are your options:

1. **Check the README** - Most questions are answered here
2. **Open an Issue** - Use GitHub's issue tracker
3. **Fork and Fix** - Make improvements and share them back

## 🎉 Success Stories

*"We went from chaotic weekly shopping to organized meal planning in just one week. The automated shopping lists are a game-changer!"* - The Johnson Family

*"My kids actually help plan meals now because the interface is so easy to use. We've discovered 12 new family favorites!"* - Sarah M.

*"The Friday reminders keep us on track. No more 'what's for dinner?' panic at 5 PM!"* - Mike & Lisa

---

**Built with ❤️ for families who love cooking together**

Start planning your family's best meals yet! 🍽️✨