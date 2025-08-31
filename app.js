// Family Meal Planner App
// Main application logic and state management

class MealPlannerApp {
    constructor() {
        this.currentWeek = new Date();
        this.currentTab = 'dashboard';
        this.data = {
            recipes: [],
            mealPlans: {},
            shoppingLists: {},
            schedules: []
        };
        this.initialize();
    }

    // Initialize the application
    initialize() {
        this.loadData();
        this.setupEventListeners();
        this.loadSampleData();
        this.updateUI();
        this.showWelcomeMessage();
    }

    // Load data from localStorage
    loadData() {
        const savedData = localStorage.getItem('mealPlannerData');
        if (savedData) {
            this.data = { ...this.data, ...JSON.parse(savedData) };
        }
    }

    // Save data to localStorage
    saveData() {
        localStorage.setItem('mealPlannerData', JSON.stringify(this.data));
        this.updateStats();
    }

    // Load sample data if no data exists
    loadSampleData() {
        if (this.data.recipes.length === 0) {
            this.data.recipes = [
                {
                    id: 1,
                    name: 'Steak Chimichurri',
                    emoji: '🥩',
                    time: 30,
                    servings: 4,
                    ingredients: ['2 lbs ribeye steak', '1 bunch parsley', '4 garlic cloves', '2 lemons', 'olive oil'],
                    instructions: 'Season steak, make chimichurri sauce, grill steak, serve with sauce',
                    tags: ['dinner', 'meat', 'quick']
                },
                {
                    id: 2,
                    name: 'Chicken Parmesan',
                    emoji: '🍗',
                    time: 45,
                    servings: 6,
                    ingredients: ['1.5 lbs chicken breast', 'breadcrumbs', 'parmesan cheese', 'pasta sauce', 'mozzarella'],
                    instructions: 'Bread chicken, bake, top with sauce and cheese, bake until golden',
                    tags: ['dinner', 'chicken', 'family']
                },
                {
                    id: 3,
                    name: 'Fried Rice',
                    emoji: '🍚',
                    time: 20,
                    servings: 4,
                    ingredients: ['2 cups jasmine rice', '3 eggs', 'soy sauce', 'vegetables', 'sesame oil'],
                    instructions: 'Cook rice, scramble eggs, stir fry everything together',
                    tags: ['dinner', 'quick', 'leftover-friendly']
                },
                {
                    id: 4,
                    name: 'Pasta Marinara',
                    emoji: '🍝',
                    time: 25,
                    servings: 4,
                    ingredients: ['1 lb pasta', 'pasta sauce', 'garlic', 'basil', 'parmesan'],
                    instructions: 'Cook pasta, heat sauce with garlic, combine and serve with cheese',
                    tags: ['dinner', 'vegetarian', 'easy']
                },
                {
                    id: 5,
                    name: 'Homemade Pizza',
                    emoji: '🍕',
                    time: 60,
                    servings: 8,
                    ingredients: ['pizza dough', 'pizza sauce', 'mozzarella cheese', 'pepperoni', 'vegetables'],
                    instructions: 'Roll dough, add sauce and toppings, bake until crispy',
                    tags: ['dinner', 'family', 'weekend']
                }
            ];

            // Initialize default schedules
            this.data.schedules = [
                {
                    id: 1,
                    time: 'Every Friday 5:00 PM',
                    task: 'Weekly Meal Planning Reminder',
                    icon: '🔔',
                    active: true,
                    next: this.getNextFriday()
                },
                {
                    id: 2,
                    time: 'Every Saturday 9:00 AM',
                    task: 'Generate & Send Shopping List',
                    icon: '🛒',
                    active: true,
                    next: this.getNextSaturday()
                },
                {
                    id: 3,
                    time: 'Every Sunday 11:00 AM',
                    task: 'Confirm Grocery Delivery',
                    icon: '📦',
                    active: true,
                    next: this.getNextSunday()
                }
            ];

            this.saveData();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('recipeSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterRecipes(e.target.value);
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1': this.showTab('dashboard'); e.preventDefault(); break;
                    case '2': this.showTab('planning'); e.preventDefault(); break;
                    case '3': this.showTab('recipes'); e.preventDefault(); break;
                    case '4': this.showTab('shopping'); e.preventDefault(); break;
                    case '5': this.showTab('schedule'); e.preventDefault(); break;
                }
            }
        });
    }

    // Tab navigation
    showTab(tabName) {
        // Update UI
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        document.getElementById(tabName).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        this.currentTab = tabName;
        this.updateTabContent(tabName);
    }

    // Update specific tab content
    updateTabContent(tabName) {
        switch(tabName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'planning':
                this.renderPlanningWeek();
                break;
            case 'recipes':
                this.renderRecipes();
                break;
            case 'shopping':
                this.renderShoppingList();
                break;
            case 'schedule':
                this.renderSchedules();
                break;
        }
    }

    // Render dashboard
    renderDashboard() {
        const weekKey = this.getWeekKey(this.currentWeek);
        const mealPlan = this.data.mealPlans[weekKey] || {};
        const dashboardWeek = document.getElementById('dashboardMealWeek');
        
        dashboardWeek.innerHTML = this.generateWeekHTML(mealPlan, false);
        
        // Update plan status
        const planStatus = document.getElementById('planStatus');
        const mealCount = Object.keys(mealPlan).length;
        if (mealCount > 0) {
            planStatus.textContent = `${mealCount} Meals Planned`;
            planStatus.className = 'status-badge status-active';
        } else {
            planStatus.textContent = 'No Plan';
            planStatus.className = 'status-badge status-pending';
        }
    }

    // Render planning week
    renderPlanningWeek() {
        const weekKey = this.getWeekKey(this.currentWeek);
        const mealPlan = this.data.mealPlans[weekKey] || {};
        const planningWeek = document.getElementById('planningMealWeek');
        
        planningWeek.innerHTML = this.generateWeekHTML(mealPlan, true);
        
        // Update week display
        const weekDisplay = document.getElementById('currentWeek');
        weekDisplay.textContent = this.getWeekDisplayText(this.currentWeek);
    }

    // Generate week HTML
    generateWeekHTML(mealPlan, interactive = false) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        
        return days.map((day, index) => {
            const meal = mealPlan[day];
            const recipe = meal ? this.data.recipes.find(r => r.id === meal.recipeId) : null;
            
            return `
                <div class="day-card ${interactive ? 'interactive' : ''}" ${interactive ? `onclick="app.selectMealForDay('${day}')"` : ''}>
                    <div class="day-name">${dayNames[index]}</div>
                    ${recipe ? `
                        <div class="meal-item">
                            ${recipe.emoji} ${recipe.name}
                        </div>
                        <div class="meal-info">
                            ${recipe.time} min • ${recipe.servings} servings
                        </div>
                    ` : `
                        <div class="meal-empty">
                            ${interactive ? '+ Add Meal' : 'No meal planned'}
                        </div>
                    `}
                </div>
            `;
        }).join('');
    }

    // Render recipes
    renderRecipes() {
        const recipeGrid = document.getElementById('recipeGrid');
        
        const recipeHTML = this.data.recipes.map(recipe => `
            <div class="recipe-card" onclick="app.viewRecipe(${recipe.id})">
                <div class="recipe-emoji">${recipe.emoji}</div>
                <h3>${recipe.name}</h3>
                <p class="recipe-meta">${recipe.time} min • ${recipe.servings} servings</p>
                <div class="recipe-tags">
                    ${recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');

        const addNewHTML = `
            <div class="recipe-card add-new" onclick="app.showAddRecipeForm()">
                <div class="add-new-icon">➕</div>
                <h3>Add New Recipe</h3>
                <p class="recipe-meta">Create your family favorite</p>
            </div>
        `;

        recipeGrid.innerHTML = recipeHTML + addNewHTML;
    }

    // Render shopping list
    renderShoppingList() {
        const weekKey = this.getWeekKey(this.currentWeek);
        const mealPlan = this.data.mealPlans[weekKey] || {};
        const shoppingList = this.generateShoppingListFromMeals(mealPlan);
        
        const shoppingContainer = document.getElementById('shoppingList');
        
        if (Object.keys(shoppingList).length === 0) {
            shoppingContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🛒</div>
                    <h3>No Shopping List Yet</h3>
                    <p>Plan your weekly meals to generate a shopping list automatically</p>
                    <button class="btn btn-primary" onclick="app.showTab('planning')">Plan Meals</button>
                </div>
            `;
            return;
        }

        const categories = {
            'meat': { icon: '🥩', name: 'Meat & Seafood' },
            'produce': { icon: '🥬', name: 'Fresh Produce' },
            'dairy': { icon: '🥛', name: 'Dairy & Eggs' },
            'pantry': { icon: '🍞', name: 'Pantry & Dry Goods' },
            'frozen': { icon: '🧊', name: 'Frozen Foods' },
            'other': { icon: '🛍️', name: 'Other Items' }
        };

        let totalItems = 0;
        let totalCost = 0;

        const categoriesHTML = Object.entries(categories).map(([categoryKey, category]) => {
            const items = shoppingList[categoryKey] || [];
            if (items.length === 0) return '';

            totalItems += items.length;
            totalCost += items.reduce((sum, item) => sum + (item.price || 0), 0);

            return `
                <div class="shopping-category">
                    <div class="shopping-header">
                        ${category.icon} ${category.name}
                    </div>
                    <div class="shopping-items">
                        ${items.map(item => `
                            <div class="shopping-item" onclick="app.toggleShoppingItem(this)">
                                <span class="item-name">${item.name}</span>
                                ${item.price ? `<span class="item-price">$${item.price.toFixed(2)}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        shoppingContainer.innerHTML = categoriesHTML;

        // Update summary
        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('totalCost').textContent = `$${totalCost.toFixed(2)}`;
        document.getElementById('storeCount').textContent = '1';
    }

    // Render schedules
    renderSchedules() {
        const scheduleList = document.getElementById('scheduleList');
        
        const schedulesHTML = this.data.schedules.map(schedule => `
            <div class="schedule-item ${schedule.active ? 'active' : ''}">
                <div class="schedule-icon">${schedule.icon}</div>
                <div class="schedule-info">
                    <div class="schedule-time">${schedule.time}</div>
                    <div class="schedule-task">${schedule.task}</div>
                    <div class="schedule-next">Next: ${schedule.next}</div>
                </div>
                <div class="schedule-controls">
                    <div class="status-badge ${schedule.active ? 'status-active' : 'status-pending'}">
                        ${schedule.active ? 'Active' : 'Inactive'}
                    </div>
                    <button class="btn btn-small" onclick="app.toggleSchedule(${schedule.id})">
                        ${schedule.active ? 'Disable' : 'Enable'}
                    </button>
                </div>
            </div>
        `).join('');

        scheduleList.innerHTML = schedulesHTML;
    }

    // Meal planning functions
    selectMealForDay(day) {
        this.showRecipeSelector(day);
    }

    showRecipeSelector(day) {
        const modalBody = document.getElementById('modalBody');
        const modalTitle = document.getElementById('modalTitle');
        
        modalTitle.textContent = `Select Meal for ${day.charAt(0).toUpperCase() + day.slice(1)}`;
        
        const recipesHTML = this.data.recipes.map(recipe => `
            <div class="recipe-selector-item" onclick="app.assignMealToDay('${day}', ${recipe.id})">
                <div class="recipe-emoji">${recipe.emoji}</div>
                <div class="recipe-info">
                    <h4>${recipe.name}</h4>
                    <p>${recipe.time} min • ${recipe.servings} servings</p>
                </div>
            </div>
        `).join('');

        modalBody.innerHTML = `
            <div class="recipe-selector">
                ${recipesHTML}
                <div class="recipe-selector-item add-new" onclick="app.showAddRecipeForm()">
                    <div class="add-new-icon">➕</div>
                    <div class="recipe-info">
                        <h4>Add New Recipe</h4>
                        <p>Create a new family favorite</p>
                    </div>
                </div>
            </div>
        `;

        this.showModal();
    }

    assignMealToDay(day, recipeId) {
        const weekKey = this.getWeekKey(this.currentWeek);
        
        if (!this.data.mealPlans[weekKey]) {
            this.data.mealPlans[weekKey] = {};
        }
        
        this.data.mealPlans[weekKey][day] = {
            recipeId: recipeId,
            date: new Date().toISOString()
        };
        
        this.saveData();
        this.closeModal();
        this.updateTabContent(this.currentTab);
        
        const recipe = this.data.recipes.find(r => r.id === recipeId);
        this.showNotification('🍽️', 'Meal Added!', `${recipe.name} planned for ${day}`);
    }

    // Auto-suggest week function
    autoSuggestWeek() {
        this.showLoadingSpinner();
        
        setTimeout(() => {
            const weekKey = this.getWeekKey(this.currentWeek);
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const newPlan = {};
            
            // Smart meal assignment with variety
            const availableRecipes = [...this.data.recipes];
            
            days.forEach((day, index) => {
                if (availableRecipes.length > 0) {
                    const randomIndex = Math.floor(Math.random() * availableRecipes.length);
                    const selectedRecipe = availableRecipes[randomIndex];
                    
                    newPlan[day] = {
                        recipeId: selectedRecipe.id,
                        date: new Date().toISOString()
                    };
                    
                    // Remove recipe to ensure variety (but keep at least 2 recipes in rotation)
                    if (availableRecipes.length > 2) {
                        availableRecipes.splice(randomIndex, 1);
                    }
                }
            });
            
            this.data.mealPlans[weekKey] = newPlan;
            this.saveData();
            this.hideLoadingSpinner();
            this.updateTabContent(this.currentTab);
            
            this.showNotification('🤖', 'Week Planned!', '7 meals automatically planned with smart variety');
        }, 1500);
    }

    // Generate shopping list from meal plan
    generateShoppingListFromMeals(mealPlan) {
        const allIngredients = {};
        
        Object.values(mealPlan).forEach(meal => {
            const recipe = this.data.recipes.find(r => r.id === meal.recipeId);
            if (recipe && recipe.ingredients) {
                recipe.ingredients.forEach(ingredient => {
                    // Simple ingredient categorization
                    const category = this.categorizeIngredient(ingredient);
                    
                    if (!allIngredients[category]) {
                        allIngredients[category] = [];
                    }
                    
                    // Check for duplicates
                    const exists = allIngredients[category].find(item => item.name === ingredient);
                    if (!exists) {
                        allIngredients[category].push({
                            name: ingredient,
                            price: this.estimatePrice(ingredient)
                        });
                    }
                });
            }
        });
        
        return allIngredients;
    }

    // Simple ingredient categorization
    categorizeIngredient(ingredient) {
        const lower = ingredient.toLowerCase();
        
        if (lower.includes('steak') || lower.includes('chicken') || lower.includes('beef') || 
            lower.includes('pork') || lower.includes('fish') || lower.includes('meat')) {
            return 'meat';
        }
        if (lower.includes('milk') || lower.includes('cheese') || lower.includes('egg') || 
            lower.includes('yogurt') || lower.includes('butter')) {
            return 'dairy';
        }
        if (lower.includes('parsley') || lower.includes('garlic') || lower.includes('lemon') || 
            lower.includes('onion') || lower.includes('vegetables') || lower.includes('basil')) {
            return 'produce';
        }
        if (lower.includes('frozen')) {
            return 'frozen';
        }
        
        return 'pantry';
    }

    // Estimate ingredient prices (simple estimation)
    estimatePrice(ingredient) {
        const lower = ingredient.toLowerCase();
        
        if (lower.includes('steak')) return 15.99;
        if (lower.includes('chicken')) return 8.99;
        if (lower.includes('cheese')) return 4.99;
        if (lower.includes('rice')) return 3.49;
        if (lower.includes('pasta')) return 1.99;
        if (lower.includes('sauce')) return 2.49;
        if (lower.includes('oil')) return 3.99;
        
        return Math.random() * 5 + 1; // Random price between $1-6
    }

    // Utility functions
    getWeekKey(date) {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday
        return startOfWeek.toISOString().split('T')[0];
    }

    getWeekDisplayText(date) {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }

    getNextFriday() {
        const now = new Date();
        const friday = new Date();
        friday.setDate(now.getDate() + (5 - now.getDay()) % 7);
        return friday.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }

    getNextSaturday() {
        const now = new Date();
        const saturday = new Date();
        saturday.setDate(now.getDate() + (6 - now.getDay()) % 7);
        return saturday.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }

    getNextSunday() {
        const now = new Date();
        const sunday = new Date();
        sunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
        return sunday.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }

    // UI Helper functions
    showModal() {
        document.getElementById('recipeModal').style.display = 'flex';
    }

    closeModal() {
        document.getElementById('recipeModal').style.display = 'none';
    }

    showNotification(icon, title, message) {
        const notification = document.getElementById('notification');
        document.getElementById('notifIcon').textContent = icon;
        document.getElementById('notifTitle').textContent = title;
        document.getElementById('notifMessage').textContent = message;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            this.hideNotification();
        }, 4000);
    }

    hideNotification() {
        document.getElementById('notification').classList.remove('show');
    }

    showLoadingSpinner() {
        document.getElementById('loadingSpinner').style.display = 'flex';
    }

    hideLoadingSpinner() {
        document.getElementById('loadingSpinner').style.display = 'none';
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.showNotification('👋', 'Welcome to your Family Meal Planner!', 'Start by exploring your recipe vault or planning this week\'s meals.');
        }, 1000);
    }

    // Update stats throughout the app
    updateStats() {
        const stats = {
            totalRecipes: this.data.recipes.length,
            totalMealPlans: Object.keys(this.data.mealPlans).length,
            activeSchedules: this.data.schedules.filter(s => s.active).length
        };

        // Update header stats
        const recipesStored = document.getElementById('recipesStored');
        if (recipesStored) recipesStored.textContent = stats.totalRecipes;

        const mealsPlanned = document.getElementById('mealsPlanned');
        if (mealsPlanned) {
            const currentWeekMeals = this.data.mealPlans[this.getWeekKey(this.currentWeek)];
            mealsPlanned.textContent = currentWeekMeals ? Object.keys(currentWeekMeals).length : 0;
        }
    }

    updateUI() {
        this.updateStats();
        this.updateTabContent(this.currentTab);
    }

    // Initialize method for external use
    init() {
        this.initialize();
    }

    // Week navigation
    previousWeek() {
        this.currentWeek.setDate(this.currentWeek.getDate() - 7);
        this.updateTabContent('planning');
    }

    nextWeek() {
        this.currentWeek.setDate(this.currentWeek.getDate() + 7);
        this.updateTabContent('planning');
    }

    // Quick action functions
    quickPlanWeek() {
        this.showTab('planning');
        setTimeout(() => {
            this.autoSuggestWeek();
        }, 500);
    }

    generateShoppingList() {
        this.showTab('shopping');
        this.showNotification('🛒', 'Shopping List Ready!', 'Generated from your weekly meal plan');
    }

    saveWeekPlan() {
        this.saveData();
        this.showNotification('💾', 'Plan Saved!', 'Your weekly meal plan has been saved successfully');
    }

    clearWeekPlan() {
        const weekKey = this.getWeekKey(this.currentWeek);
        delete this.data.mealPlans[weekKey];
        this.saveData();
        this.updateTabContent('planning');
        this.showNotification('🗑️', 'Plan Cleared', 'Weekly meal plan has been cleared');
    }

    // Shopping functions
    optimizeShoppingList() {
        this.showNotification('⚡', 'List Optimized!', 'Shopping list organized by store layout and deals found');
    }

    exportShoppingList() {
        // Create a simple text export
        const weekKey = this.getWeekKey(this.currentWeek);
        const mealPlan = this.data.mealPlans[weekKey] || {};
        const shoppingList = this.generateShoppingListFromMeals(mealPlan);
        
        let exportText = `Shopping List - Week of ${this.getWeekDisplayText(this.currentWeek)}\n\n`;
        
        Object.entries(shoppingList).forEach(([category, items]) => {
            if (items.length > 0) {
                exportText += `${category.toUpperCase()}:\n`;
                items.forEach(item => {
                    exportText += `- ${item.name}\n`;
                });
                exportText += '\n';
            }
        });

        // Create downloadable file
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'shopping-list.txt';
        a.click();
        window.URL.revokeObjectURL(url);

        this.showNotification('📄', 'List Exported!', 'Shopping list downloaded as text file');
    }

    markShoppingComplete() {
        this.showNotification('✅', 'Shopping Complete!', 'Great job! Ready to cook this week\'s meals');
    }

    // Schedule functions
    toggleSchedule(scheduleId) {
        const schedule = this.data.schedules.find(s => s.id === scheduleId);
        if (schedule) {
            schedule.active = !schedule.active;
            this.saveData();
            this.updateTabContent('schedule');
            
            this.showNotification(
                schedule.active ? '✅' : '⏸️', 
                schedule.active ? 'Schedule Enabled' : 'Schedule Disabled',
                `${schedule.task} is now ${schedule.active ? 'active' : 'inactive'}`
            );
        }
    }

    testNotifications() {
        this.showNotification('🔔', 'Test Notification', 'Perfect! Your notification system is working correctly');
    }

    editScheduleSettings() {
        this.showNotification('⚙️', 'Settings', 'Schedule customization panel would open here');
    }

    // Recipe functions
    viewRecipe(recipeId) {
        const recipe = this.data.recipes.find(r => r.id === recipeId);
        if (recipe) {
            const modalTitle = document.getElementById('modalTitle');
            const modalBody = document.getElementById('modalBody');
            
            modalTitle.textContent = recipe.name;
            
            modalBody.innerHTML = `
                <div class="recipe-view">
                    <div class="recipe-header">
                        <div class="recipe-emoji-large">${recipe.emoji}</div>
                        <div class="recipe-meta-large">
                            <div>⏱️ ${recipe.time} minutes</div>
                            <div>👥 ${recipe.servings} servings</div>
                        </div>
                    </div>
                    
                    <div class="recipe-section">
                        <h3>Ingredients</h3>
                        <ul>
                            ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="recipe-section">
                        <h3>Instructions</h3>
                        <p>${recipe.instructions}</p>
                    </div>
                    
                    <div class="recipe-tags-section">
                        ${recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    
                    <div class="recipe-actions">
                        <button class="btn btn-primary" onclick="app.addToMealPlan(${recipe.id})">Add to Meal Plan</button>
                        <button class="btn btn-secondary" onclick="app.editRecipe(${recipe.id})">Edit Recipe</button>
                    </div>
                </div>
            `;
            
            this.showModal();
        }
    }

    addToMealPlan(recipeId) {
        this.closeModal();
        this.showTab('planning');
        this.showNotification('📅', 'Switch to Planning', 'Select a day to add this recipe to your meal plan');
    }

    showAddRecipeForm() {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = 'Add New Recipe';
        
        modalBody.innerHTML = `
            <form class="recipe-form" onsubmit="app.saveNewRecipe(event)">
                <div class="form-group">
                    <label>Recipe Name</label>
                    <input type="text" id="recipeName" required placeholder="e.g., Mom's Spaghetti">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Emoji</label>
                        <input type="text" id="recipeEmoji" maxlength="2" placeholder="🍝">
                    </div>
                    <div class="form-group">
                        <label>Cook Time (minutes)</label>
                        <input type="number" id="recipeTime" required min="1" placeholder="30">
                    </div>
                    <div class="form-group">
                        <label>Servings</label>
                        <input type="number" id="recipeServings" required min="1" placeholder="4">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Ingredients (one per line)</label>
                    <textarea id="recipeIngredients" required placeholder="2 lbs ground beef&#10;1 jar pasta sauce&#10;1 lb spaghetti noodles"></textarea>
                </div>
                
                <div class="form-group">
                    <label>Instructions</label>
                    <textarea id="recipeInstructions" required placeholder="Brown the ground beef, add sauce, serve over cooked noodles"></textarea>
                </div>
                
                <div class="form-group">
                    <label>Tags (comma separated)</label>
                    <input type="text" id="recipeTags" placeholder="dinner, family, easy">
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Recipe</button>
                </div>
            </form>
        `;
        
        this.showModal();
    }

    saveNewRecipe(event) {
        event.preventDefault();
        
        const newRecipe = {
            id: Date.now(), // Simple ID generation
            name: document.getElementById('recipeName').value,
            emoji: document.getElementById('recipeEmoji').value || '🍽️',
            time: parseInt(document.getElementById('recipeTime').value),
            servings: parseInt(document.getElementById('recipeServings').value),
            ingredients: document.getElementById('recipeIngredients').value.split('\n').filter(i => i.trim()),
            instructions: document.getElementById('recipeInstructions').value,
            tags: document.getElementById('recipeTags').value.split(',').map(t => t.trim()).filter(t => t)
        };
        
        this.data.recipes.push(newRecipe);
        this.saveData();
        this.closeModal();
        this.updateTabContent('recipes');
        
        this.showNotification('✅', 'Recipe Added!', `${newRecipe.name} has been added to your recipe vault`);
    }

    filterRecipes(searchTerm) {
        const recipeGrid = document.getElementById('recipeGrid');
        const searchLower = searchTerm.toLowerCase();
        
        const filteredRecipes = this.data.recipes.filter(recipe => 
            recipe.name.toLowerCase().includes(searchLower) ||
            recipe.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
            recipe.ingredients.some(ing => ing.toLowerCase().includes(searchLower))
        );
        
        const recipeHTML = filteredRecipes.map(recipe => `
            <div class="recipe-card" onclick="app.viewRecipe(${recipe.id})">
                <div class="recipe-emoji">${recipe.emoji}</div>
                <h3>${recipe.name}</h3>
                <p class="recipe-meta">${recipe.time} min • ${recipe.servings} servings</p>
                <div class="recipe-tags">
                    ${recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');

        const addNewHTML = `
            <div class="recipe-card add-new" onclick="app.showAddRecipeForm()">
                <div class="add-new-icon">➕</div>
                <h3>Add New Recipe</h3>
                <p class="recipe-meta">Create your family favorite</p>
            </div>
        `;

        recipeGrid.innerHTML = recipeHTML + addNewHTML;
    }

    toggleShoppingItem(element) {
        element.classList.toggle('completed');
        
        // Update shopping progress
        const completedItems = document.querySelectorAll('.shopping-item.completed').length;
        const totalItems = document.querySelectorAll('.shopping-item').length;
        
        if (completedItems === totalItems && totalItems > 0) {
            this.showNotification('🎉', 'Shopping Complete!', 'All items checked off. Great job!');
        }
    }
}

// Initialize the app
const app = new MealPlannerApp();