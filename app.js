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
        this.searchResults = [];
        this.selectedRecipe = null;
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

    // Smart Recipe Search Functions
    showAddRecipeForm() {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = 'Add New Recipe';
        
        modalBody.innerHTML = `
            <div class="recipe-search-section">
                <div class="search-method-toggle">
                    <button type="button" class="search-toggle active" onclick="app.showSearchMode()" id="searchModeBtn">
                        🔍 Find Recipe
                    </button>
                    <button type="button" class="search-toggle" onclick="app.showManualMode()" id="manualModeBtn">
                        ✍️ Enter Manually
                    </button>
                </div>
                
                <!-- Smart Recipe Search Mode -->
                <div id="searchMode" class="search-mode active">
                    <div class="recipe-search-form">
                        <div class="form-group">
                            <label>What dish do you want to add?</label>
                            <div class="search-input-container">
                                <input type="text" id="dishSearchInput" placeholder="e.g., Chicken Parmesan, Beef Stroganoff, Thai Green Curry" />
                                <button type="button" class="btn btn-primary search-btn" onclick="app.searchForRecipe()">
                                    🔍 Find Recipe
                                </button>
                            </div>
                            <div class="search-hint">
                                💡 Just enter the dish name - we'll find a great recipe for you!
                            </div>
                        </div>
                    </div>
                    
                    <!-- Search Results -->
                    <div id="searchResults" class="search-results" style="display: none;">
                        <h3>Found Recipes:</h3>
                        <div id="recipeOptions" class="recipe-options">
                            <!-- Will be populated by search results -->
                        </div>
                    </div>
                    
                    <!-- Selected Recipe Preview -->
                    <div id="recipePreview" class="recipe-preview" style="display: none;">
                        <h3>Recipe Preview</h3>
                        <div class="preview-content">
                            <!-- Will show the selected recipe for approval -->
                        </div>
                        <div class="preview-actions">
                            <button type="button" class="btn btn-secondary" onclick="app.backToSearch()">← Back to Search</button>
                            <button type="button" class="btn btn-primary" onclick="app.approveFoundRecipe()">✅ Add This Recipe</button>
                        </div>
                    </div>
                </div>
                
                <!-- Manual Entry Mode -->
                <div id="manualMode" class="search-mode" style="display: none;">
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
                </div>
            </div>
        `;
        
        this.showModal();
    }

    // Recipe search mode functions
    showSearchMode() {
        document.getElementById('searchMode').style.display = 'block';
        document.getElementById('manualMode').style.display = 'none';
        document.getElementById('searchModeBtn').classList.add('active');
        document.getElementById('manualModeBtn').classList.remove('active');
    }

    showManualMode() {
        document.getElementById('searchMode').style.display = 'none';
        document.getElementById('manualMode').style.display = 'block';
        document.getElementById('searchModeBtn').classList.remove('active');
        document.getElementById('manualModeBtn').classList.add('active');
    }

    async searchForRecipe() {
        const dishName = document.getElementById('dishSearchInput').value.trim();
        
        if (!dishName) {
            this.showNotification('⚠️', 'Enter Dish Name', 'Please enter the name of the dish you want to find');
            return;
        }

        this.showLoadingSpinner();
        
        try {
            // Show searching notification
            this.showNotification('🔍', 'Searching...', `Finding recipes for ${dishName} from all premium sources`);
            
            // Search across all sources immediately
            const recipes = await this.simulateRecipeSearchAllSources(dishName);
            
            this.hideLoadingSpinner();
            this.displayModernRecipeResults(recipes, dishName);
            
        } catch (error) {
            this.hideLoadingSpinner();
            this.showNotification('❌', 'Search Failed', 'Could not find recipes. Please try manual entry.');
            console.error('Recipe search error:', error);
        }
    }

    async simulateRecipeSearchAllSources(dishName) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Comprehensive recipe database with multiple sources
        const allRecipes = [
            // Tuscan Chicken variations
            {
                name: 'Tuscan Chicken Skillet',
                emoji: '🍗',
                time: 35,
                servings: 4,
                source: 'Food Network',
                sourceType: 'premium',
                rating: 4.8,
                difficulty: 'Easy',
                description: 'Creamy chicken with sun-dried tomatoes and spinach',
                ingredients: [
                    '4 boneless chicken thighs',
                    '1 cup heavy cream',
                    '1/2 cup sun-dried tomatoes',
                    '2 cups fresh spinach',
                    '3 cloves garlic, minced',
                    '1/2 cup white wine',
                    '1/2 cup parmesan cheese',
                    'Italian seasoning',
                    'Salt and pepper'
                ],
                instructions: 'Season chicken and sear in hot skillet until golden. Remove chicken. Sauté garlic, add wine and sun-dried tomatoes. Stir in cream, bring to simmer. Add spinach and parmesan. Return chicken, simmer until cooked through.',
                tags: ['tuscan', 'chicken', 'creamy', 'one-pan'],
                matchScore: 0.95
            },
            {
                name: 'Tuscan Herb Roasted Chicken',
                emoji: '🌿',
                time: 60,
                servings: 6,
                source: 'Bon Appétit',
                sourceType: 'premium',
                rating: 4.7,
                difficulty: 'Medium',
                description: 'Whole chicken with rosemary, thyme, and lemon',
                ingredients: [
                    '1 whole chicken (3-4 lbs)',
                    '2 lemons, sliced',
                    '4 sprigs fresh rosemary',
                    '6 sprigs fresh thyme',
                    '4 cloves garlic',
                    '1/4 cup olive oil',
                    'Tuscan herb blend',
                    'Coarse sea salt'
                ],
                instructions: 'Preheat oven to 425°F. Stuff chicken cavity with herbs and lemon. Rub skin with olive oil and seasonings. Roast 50-60 minutes until internal temp reaches 165°F. Let rest 10 minutes before carving.',
                tags: ['tuscan', 'roasted', 'herbs', 'whole-chicken'],
                matchScore: 0.90
            },
            {
                name: 'Creamy Tuscan Chicken Pasta',
                emoji: '🍝',
                time: 30,
                servings: 4,
                source: 'Serious Eats',
                sourceType: 'premium',
                rating: 4.9,
                difficulty: 'Easy',
                description: 'Penne with chicken in rich tomato cream sauce',
                ingredients: [
                    '1 lb penne pasta',
                    '2 lbs chicken breast, cubed',
                    '1 cup heavy cream',
                    '1 can diced tomatoes',
                    '1/2 cup sun-dried tomatoes',
                    '3 cups fresh spinach',
                    '1 cup parmesan, grated',
                    'Italian herbs',
                    'Garlic and onion'
                ],
                instructions: 'Cook pasta al dente. Sear chicken until golden. Sauté aromatics, add tomatoes and cream. Simmer until thick. Toss with pasta, chicken, spinach and cheese. Finish with fresh herbs.',
                tags: ['tuscan', 'pasta', 'chicken', 'creamy'],
                matchScore: 0.88
            },
            // Add some related alternatives
            {
                name: 'Mediterranean Chicken Thighs',
                emoji: '🫒',
                time: 40,
                servings: 4,
                source: 'NYTimes Cooking',
                sourceType: 'trusted',
                rating: 4.6,
                difficulty: 'Easy',
                description: 'One-pan chicken with olives and tomatoes',
                ingredients: [
                    '8 chicken thighs',
                    '1 cup kalamata olives',
                    '1 pint cherry tomatoes',
                    '1/4 cup olive oil',
                    'Fresh oregano',
                    'Lemon juice',
                    'Feta cheese'
                ],
                instructions: 'Brown chicken thighs skin-side down. Add olives, tomatoes, and herbs. Bake until chicken is cooked through. Finish with lemon and feta.',
                tags: ['mediterranean', 'chicken', 'olives', 'one-pan'],
                matchScore: 0.75
            },
            {
                name: 'Italian Chicken Parmesan',
                emoji: '🍗',
                time: 45,
                servings: 4,
                source: 'AllRecipes',
                sourceType: 'community',
                rating: 4.5,
                difficulty: 'Medium',
                description: 'Classic breaded chicken with marinara and cheese',
                ingredients: [
                    '4 chicken breasts',
                    '1 cup breadcrumbs',
                    '1/2 cup parmesan',
                    '2 cups marinara sauce',
                    '1 cup mozzarella',
                    'Eggs for breading',
                    'Italian seasoning'
                ],
                instructions: 'Bread chicken with seasoned crumbs and parmesan. Fry until golden. Top with sauce and cheese, bake until bubbly.',
                tags: ['italian', 'chicken', 'breaded', 'classic'],
                matchScore: 0.70
            }
        ];

        // Filter and sort by relevance to search term
        const searchTerm = dishName.toLowerCase();
        let matches = allRecipes.filter(recipe => {
            const nameMatch = recipe.name.toLowerCase().includes(searchTerm);
            const tagMatch = recipe.tags.some(tag => tag.includes(searchTerm) || searchTerm.includes(tag));
            const descMatch = recipe.description.toLowerCase().includes(searchTerm);
            
            return nameMatch || tagMatch || descMatch;
        });

        // Sort by match score (higher is better)
        matches.sort((a, b) => b.matchScore - a.matchScore);

        // If no matches, return popular alternatives
        if (matches.length === 0) {
            matches = allRecipes.slice(0, 3);
        }

        return matches.slice(0, 4); // Return top 4 results
    }

    displayModernRecipeResults(recipes, searchTerm) {
        const searchResults = document.getElementById('searchResults');
        const recipeOptions = document.getElementById('recipeOptions');
        
        if (recipes.length === 0) {
            recipeOptions.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">😔</div>
                    <h4>No recipes found for "${searchTerm}"</h4>
                    <p>Try a different dish name or use manual entry</p>
                    <button class="btn btn-secondary" onclick="app.showManualMode()">Enter Manually</button>
                </div>
            `;
        } else {
            recipeOptions.innerHTML = `
                <div class="modern-results-header">
                    <h4>Found ${recipes.length} recipes for "${searchTerm}"</h4>
                    <div class="filter-hint">💡 Recipes sorted by relevance and quality</div>
                </div>
                <div class="modern-recipe-grid">
                    ${recipes.map((recipe, index) => `
                        <div class="modern-recipe-card ${recipe.sourceType}" onclick="app.selectFoundRecipe(${index})">
                            <div class="recipe-card-header">
                                <div class="recipe-emoji-large">${recipe.emoji}</div>
                                <div class="source-badge ${recipe.sourceType}">
                                    <span class="source-name">${recipe.source}</span>
                                    <span class="source-rating">★ ${recipe.rating}</span>
                                </div>
                            </div>
                            
                            <div class="recipe-card-content">
                                <h4 class="recipe-title">${recipe.name}</h4>
                                <p class="recipe-description">${recipe.description}</p>
                                
                                <div class="recipe-meta-row">
                                    <span class="meta-item">⏱️ ${recipe.time} min</span>
                                    <span class="meta-item">👥 ${recipe.servings}</span>
                                    <span class="meta-item difficulty-${recipe.difficulty.toLowerCase()}">${recipe.difficulty}</span>
                                </div>
                                
                                <div class="recipe-tags-preview">
                                    ${recipe.tags.slice(0, 3).map(tag => `<span class="tag-mini">${tag}</span>`).join('')}
                                </div>
                            </div>
                            
                            <div class="recipe-card-action">
                                <div class="action-button">
                                    <span class="action-text">View Recipe</span>
                                    <span class="action-arrow">→</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // Store results for later use
        this.searchResults = recipes;
        searchResults.style.display = 'block';
        
        this.showNotification('✅', 'Recipes Found!', `Found ${recipes.length} quality recipes matching "${searchTerm}"`);
    }

    async simulateRecipeSearchWithSource(dishName, source) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Premium source databases with quality-specific recipes
        const premiumSources = {
            'food-network': {
                'chicken parmesan': {
                    name: 'Food Network\'s Perfect Chicken Parmesan',
                    emoji: '🍗',
                    time: 50,
                    servings: 4,
                    source: 'Food Network',
                    rating: 4.8,
                    ingredients: [
                        '4 boneless, skinless chicken breasts, pounded to 1/2-inch thick',
                        '1 cup all-purpose flour',
                        '2 large eggs, beaten',
                        '1 1/2 cups panko breadcrumbs',
                        '1/2 cup freshly grated Parmigiano-Reggiano',
                        '2 cups high-quality marinara sauce',
                        '8 oz fresh mozzarella, sliced',
                        '1/4 cup fresh basil leaves',
                        'Kosher salt and freshly ground black pepper',
                        'Extra-virgin olive oil for frying'
                    ],
                    instructions: 'Season chicken with salt and pepper. Set up breading station with flour, eggs, and panko mixed with Parmesan. Bread chicken thoroughly. Heat oil to 350°F, fry chicken 4-5 minutes per side until golden. Transfer to baking sheet, top with sauce and mozzarella. Bake at 425°F for 15 minutes until cheese bubbles. Garnish with fresh basil.',
                    tags: ['dinner', 'italian', 'family', 'chef-tested']
                }
            },
            'serious-eats': {
                'chicken parmesan': {
                    name: 'The Science of Perfect Chicken Parm',
                    emoji: '🧪',
                    time: 60,
                    servings: 4,
                    source: 'Serious Eats',
                    rating: 4.9,
                    ingredients: [
                        '4 chicken breasts, butterflied and pounded to even thickness',
                        '1 cup Wondra flour (for superior coating)',
                        '3 whole eggs plus 1 yolk',
                        '2 cups Japanese panko breadcrumbs',
                        '1/2 cup aged Parmigiano-Reggiano, microplaned',
                        '2 cups San Marzano tomato sauce',
                        '6 oz low-moisture mozzarella, hand-torn',
                        'Diamond Crystal kosher salt',
                        'Tellicherry black pepper',
                        'Neutral oil for frying (canola or vegetable)'
                    ],
                    instructions: 'Brine chicken in 6% salt solution for 2 hours. Pat dry, season with pepper. Use three-stage breading with Wondra flour, egg wash with extra yolk, and panko-Parmesan mixture. Press coating firmly. Fry at precisely 350°F, monitoring with thermometer, 4 minutes per side. Internal temp should reach 150°F. Top with sauce and cheese, broil 3-4 minutes until bubbly.',
                    tags: ['dinner', 'italian', 'technique-focused', 'science-based']
                }
            },
            'bon-appetit': {
                'chicken parmesan': {
                    name: 'BA\'s Best Chicken Parmigiana',
                    emoji: '🍷',
                    time: 45,
                    servings: 4,
                    source: 'Bon Appétit',
                    rating: 4.7,
                    ingredients: [
                        '4 chicken cutlets, pounded thin',
                        '1 cup "00" flour',
                        '2 farm-fresh eggs, beaten',
                        '1 1/2 cups fine breadcrumbs',
                        '3/4 cup Parmigiano-Reggiano, finely grated',
                        '2 cups arrabbiata sauce',
                        '6 oz buffalo mozzarella, torn',
                        'Maldon sea salt',
                        'Calabrian chili flakes',
                        'Good olive oil',
                        'Fresh oregano leaves'
                    ],
                    instructions: 'Season cutlets with Maldon salt. Dredge in "00" flour, egg wash, then breadcrumb-cheese mixture. Shallow fry in good olive oil until golden and crispy. Arrange in baking dish, top with arrabbiata and torn mozzarella. Bake until cheese melts beautifully. Finish with oregano and chili flakes.',
                    tags: ['dinner', 'italian', 'restaurant-style', 'sophisticated']
                }
            }
        };

        const communitySource = {
            'allrecipes': {
                'chicken parmesan': {
                    name: 'Classic Chicken Parmesan',
                    emoji: '🍗',
                    time: 40,
                    servings: 4,
                    source: 'AllRecipes',
                    rating: 4.5,
                    ingredients: [
                        '4 chicken breasts',
                        '1 cup flour',
                        '2 eggs, beaten',
                        '1 cup breadcrumbs',
                        '1/2 cup parmesan cheese',
                        '2 cups marinara sauce',
                        '1 cup mozzarella cheese, shredded',
                        'Salt and pepper',
                        'Vegetable oil'
                    ],
                    instructions: 'Pound chicken thin. Season with salt and pepper. Coat in flour, dip in eggs, then coat with breadcrumb-parmesan mixture. Fry in oil until golden brown. Top with sauce and cheese, bake until cheese melts.',
                    tags: ['dinner', 'family', 'easy', 'crowd-favorite']
                }
            }
        };

        // Search logic based on source
        const searchTerm = dishName.toLowerCase();
        let sourceData = {};
        
        if (source === 'all-sources') {
            // Combine premium sources for comprehensive search
            sourceData = { ...premiumSources['food-network'], ...premiumSources['serious-eats'], ...premiumSources['bon-appetit'] };
        } else if (premiumSources[source]) {
            sourceData = premiumSources[source];
        } else if (source === 'allrecipes') {
            sourceData = communitySource['allrecipes'];
        } else {
            sourceData = premiumSources['food-network']; // Fallback to Food Network
        }

        const matches = [];

        // Find matching recipes
        if (sourceData[searchTerm]) {
            matches.push(sourceData[searchTerm]);
        }

        // Partial matches
        Object.entries(sourceData).forEach(([key, recipe]) => {
            if (key.includes(searchTerm) || searchTerm.includes(key.split(' ')[0])) {
                if (!matches.find(m => m.name === recipe.name)) {
                    matches.push(recipe);
                }
            }
        });

        // Add more dishes to each source for variety
        const additionalDishes = this.getAdditionalDishesForSource(source, searchTerm);
        matches.push(...additionalDishes);

        return matches.slice(0, 3); // Return top 3 results
    }

    getAdditionalDishesForSource(source, searchTerm) {
        // Return source-appropriate additional dishes based on the search term
        const foodNetworkDishes = [
            {
                name: 'Food Network\'s Beef Stroganoff',
                emoji: '🥩',
                time: 45,
                servings: 6,
                source: 'Food Network',
                rating: 4.7,
                ingredients: ['2 lbs beef tenderloin', 'cremini mushrooms', 'sour cream', 'egg noodles', 'beef stock'],
                instructions: 'Professional technique for restaurant-quality stroganoff...',
                tags: ['dinner', 'comfort-food', 'chef-approved']
            }
        ];

        const seriousEatsDishes = [
            {
                name: 'The Ultimate Thai Green Curry',
                emoji: '🍛',
                time: 90,
                servings: 4,
                source: 'Serious Eats',
                rating: 4.9,
                ingredients: ['homemade green curry paste', 'coconut cream', 'thai eggplants', 'kaffir lime leaves'],
                instructions: 'Deep dive into authentic Thai cooking techniques...',
                tags: ['dinner', 'thai', 'authentic', 'technique-intensive']
            }
        ];

        const bonAppetitDishes = [
            {
                name: 'BA\'s Cacio e Pepe Perfected',
                emoji: '🍝',
                time: 25,
                servings: 4,
                source: 'Bon Appétit',
                rating: 4.8,
                ingredients: ['pecorino romano', 'fresh cracked pepper', 'spaghetti', 'pasta water'],
                instructions: 'The restaurant secret to perfect emulsification...',
                tags: ['dinner', 'italian', 'minimalist', 'restaurant-quality']
            }
        ];

        // Return dishes based on source
        switch(source) {
            case 'food-network':
                return foodNetworkDishes.slice(0, 2);
            case 'serious-eats':
                return seriousEatsDishes.slice(0, 2);
            case 'bon-appetit':
                return bonAppetitDishes.slice(0, 2);
            case 'all-sources':
                return [...foodNetworkDishes.slice(0, 1), ...seriousEatsDishes.slice(0, 1)];
            default:
                return foodNetworkDishes.slice(0, 1);
        }
    }

    displayRecipeSearchResults(recipes, searchTerm, source) {
        const searchResults = document.getElementById('searchResults');
        const recipeOptions = document.getElementById('recipeOptions');
        
        if (recipes.length === 0) {
            recipeOptions.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">😔</div>
                    <h4>No recipes found for "${searchTerm}"</h4>
                    <p>Try a different dish name or source</p>
                    <button class="btn btn-secondary" onclick="app.showManualMode()">Enter Manually</button>
                </div>
            `;
        } else {
            const sourceName = this.getSourceDisplayName(source);
            recipeOptions.innerHTML = `
                <div class="results-header">
                    <h4>Found ${recipes.length} ${sourceName} recipes for "${searchTerm}"</h4>
                    <button class="btn btn-secondary btn-small" onclick="app.searchForRecipe()">← Choose Different Source</button>
                </div>
                ${recipes.map((recipe, index) => `
                    <div class="recipe-option premium-result" onclick="app.selectFoundRecipe(${index})">
                        <div class="recipe-option-emoji">${recipe.emoji}</div>
                        <div class="recipe-option-info">
                            <h4>${recipe.name}</h4>
                            <div class="recipe-source-badge">
                                <span class="source-name">${recipe.source}</span>
                                ${recipe.rating ? `<span class="source-rating">★ ${recipe.rating}</span>` : ''}
                            </div>
                            <div class="recipe-option-meta">
                                ⏱️ ${recipe.time} min • 👥 ${recipe.servings} servings
                            </div>
                            <div class="recipe-option-tags">
                                ${recipe.tags.slice(0, 3).map(tag => `<span class="mini-tag premium">${tag}</span>`).join('')}
                            </div>
                        </div>
                        <div class="recipe-option-action">
                            <span class="select-arrow">→</span>
                        </div>
                    </div>
                `).join('')}
            `;
        }
        
        // Store results for later use
        this.searchResults = recipes;
        searchResults.style.display = 'block';
        
        const sourceName = this.getSourceDisplayName(source);
        this.showNotification('✅', 'Quality Recipes Found!', `Found ${recipes.length} ${sourceName} recipes with professional techniques`);
    }

    selectFoundRecipe(index) {
        const recipe = this.searchResults[index];
        this.selectedRecipe = recipe;
        
        const recipePreview = document.getElementById('recipePreview');
        const previewContent = recipePreview.querySelector('.preview-content');
        
        previewContent.innerHTML = `
            <div class="recipe-preview-header">
                <div class="recipe-preview-emoji">${recipe.emoji}</div>
                <div class="recipe-preview-info">
                    <h3>${recipe.name}</h3>
                    <div class="recipe-preview-meta">
                        ⏱️ ${recipe.time} minutes • 👥 ${recipe.servings} servings
                    </div>
                </div>
            </div>
            
            <div class="recipe-preview-section">
                <h4>Ingredients:</h4>
                <ul class="ingredient-list">
                    ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
            
            <div class="recipe-preview-section">
                <h4>Instructions:</h4>
                <p class="instructions-text">${recipe.instructions}</p>
            </div>
            
            <div class="recipe-preview-tags">
                ${recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            
            <div class="edit-hint">
                💡 You can edit any details after adding this recipe to your vault
            </div>
        `;
        
        document.getElementById('searchResults').style.display = 'none';
        recipePreview.style.display = 'block';
    }

    backToSearch() {
        document.getElementById('searchResults').style.display = 'block';
        document.getElementById('recipePreview').style.display = 'none';
    }

    approveFoundRecipe() {
        if (!this.selectedRecipe) return;
        
        const newRecipe = {
            id: Date.now(),
            name: this.selectedRecipe.name,
            emoji: this.selectedRecipe.emoji,
            time: this.selectedRecipe.time,
            servings: this.selectedRecipe.servings,
            ingredients: this.selectedRecipe.ingredients,
            instructions: this.selectedRecipe.instructions,
            tags: this.selectedRecipe.tags
        };
        
        this.data.recipes.push(newRecipe);
        this.saveData();
        this.closeModal();
        this.updateTabContent('recipes');
        
        this.showNotification('🎉', 'Recipe Added!', `${newRecipe.name} has been added to your recipe vault!`);
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
            this.showNotification('👋', 'Welcome to your Family Meal Planner!', 'Try the new smart recipe search - just type "Chicken Parmesan" and watch the magic!');
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
