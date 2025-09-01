// Enhanced Family Meal Planner - Fixed Profile Popup Issue
class FamilyMealPlanner {
    constructor() {
        this.recipes = JSON.parse(localStorage.getItem('mealPlannerRecipes')) || this.getDefaultRecipes();
        this.mealPlans = JSON.parse(localStorage.getItem('mealPlannerPlans')) || {};
        this.shoppingLists = JSON.parse(localStorage.getItem('mealPlannerShopping')) || {};
        this.userProfile = JSON.parse(localStorage.getItem('mealPlannerProfile')) || null;
        this.currentDate = new Date();
        this.currentTab = 'dashboard';
        this.init();
    }

    // High-Quality Recipe Database with Multiple Sources
    async searchRecipes(query) {
        if (!query || query.trim().length < 2) {
            return [];
        }

        try {
            // Try multiple high-quality recipe sources in order of preference
            const sources = [
                () => this.searchPremiumRecipes(query),
                () => this.searchBackupRecipes(query),
                () => this.searchBuiltInRecipes(query)
            ];

            for (const source of sources) {
                try {
                    const results = await source();
                    if (results && results.length > 0) {
                        return results.slice(0, 6); // Limit to top 6 results
                    }
                } catch (error) {
                    console.log(`Source failed, trying next...`, error);
                    continue;
                }
            }

            return this.searchBuiltInRecipes(query);
        } catch (error) {
            console.error('Recipe search failed:', error);
            return this.searchBuiltInRecipes(query);
        }
    }

    // Premium Recipe Sources (Food Network, Serious Eats, etc.)
    async searchPremiumRecipes(query) {
        // Simulate premium recipe API calls
        // In production, this would connect to actual APIs
        const premiumRecipes = {
            'chicken': [
                {
                    id: `premium_${Date.now()}_1`,
                    name: 'Perfect Roast Chicken',
                    source: 'Serious Eats',
                    rating: 4.8,
                    difficulty: 'Medium',
                    time: '90 min',
                    servings: 4,
                    image: '🍗',
                    tags: ['dinner', 'family', 'protein', 'roasted'],
                    ingredients: [
                        '1 whole chicken (3-4 lbs)',
                        '2 tbsp olive oil',
                        '1 tbsp kosher salt',
                        '1 tsp black pepper',
                        '2 tsp fresh thyme',
                        '4 garlic cloves, minced',
                        '1 lemon, halved',
                        '2 carrots, chopped',
                        '2 celery stalks, chopped'
                    ],
                    instructions: [
                        'Preheat oven to 425°F (220°C)',
                        'Pat chicken completely dry with paper towels',
                        'Mix salt, pepper, thyme, and garlic in a bowl',
                        'Rub seasoning mixture all over chicken, under and over skin',
                        'Stuff lemon halves into cavity',
                        'Place vegetables in roasting pan, set chicken on top',
                        'Roast 60-75 minutes until internal temp reaches 165°F',
                        'Rest 10 minutes before carving'
                    ],
                    nutritionHighlights: ['High Protein', 'Low Carb', 'Gluten Free'],
                    tips: 'For extra crispy skin, let chicken air-dry in fridge for 2+ hours before cooking'
                },
                {
                    id: `premium_${Date.now()}_2`,
                    name: 'Chicken Parmesan',
                    source: 'Food Network',
                    rating: 4.7,
                    difficulty: 'Medium',
                    time: '45 min',
                    servings: 4,
                    image: '🍗',
                    tags: ['dinner', 'italian', 'crispy', 'cheese'],
                    ingredients: [
                        '4 chicken breasts, pounded thin',
                        '2 cups Italian breadcrumbs',
                        '1 cup grated Parmesan cheese',
                        '2 eggs, beaten',
                        '1 cup all-purpose flour',
                        '2 cups marinara sauce',
                        '8 oz fresh mozzarella, sliced',
                        '1/4 cup fresh basil',
                        'Olive oil for frying'
                    ],
                    instructions: [
                        'Set up breading station: flour, beaten eggs, breadcrumb-parmesan mix',
                        'Season chicken with salt and pepper',
                        'Coat each breast: flour → egg → breadcrumb mixture',
                        'Heat oil in large skillet over medium-high heat',
                        'Fry chicken 3-4 minutes per side until golden',
                        'Transfer to baking dish, top with sauce and mozzarella',
                        'Bake at 425°F for 15 minutes until cheese melts',
                        'Garnish with fresh basil and serve'
                    ],
                    nutritionHighlights: ['High Protein', 'Family Favorite'],
                    tips: 'Double-coat for extra crispy texture. Use fresh mozzarella for best melting.'
                }
            ],
            'pasta': [
                {
                    id: `premium_${Date.now()}_3`,
                    name: 'Authentic Carbonara',
                    source: 'Bon Appétit',
                    rating: 4.9,
                    difficulty: 'Medium',
                    time: '20 min',
                    servings: 4,
                    image: '🍝',
                    tags: ['dinner', 'italian', 'quick', 'eggs'],
                    ingredients: [
                        '1 lb spaghetti or linguine',
                        '6 oz guanciale or pancetta, diced',
                        '4 large egg yolks',
                        '1 whole egg',
                        '1 cup Pecorino Romano, finely grated',
                        '1/2 cup Parmigiano-Reggiano, grated',
                        'Freshly cracked black pepper',
                        'Kosher salt'
                    ],
                    instructions: [
                        'Cook pasta in heavily salted water until al dente',
                        'Meanwhile, render guanciale in large skillet until crispy',
                        'Whisk together eggs, cheeses, and lots of black pepper',
                        'Reserve 1 cup pasta water before draining',
                        'Add hot pasta to skillet with guanciale',
                        'Remove from heat, add egg mixture while tossing vigorously',
                        'Add pasta water gradually until creamy sauce forms',
                        'Serve immediately with extra cheese and pepper'
                    ],
                    nutritionHighlights: ['High Protein', 'Traditional Italian'],
                    tips: 'The key is temperature - too hot and eggs scramble, too cool and sauce won\'t form'
                }
            ],
            'thai': [
                {
                    id: `premium_${Date.now()}_4`,
                    name: 'Thai Green Curry',
                    source: 'Serious Eats',
                    rating: 4.8,
                    difficulty: 'Medium',
                    time: '35 min',
                    servings: 4,
                    image: '🍛',
                    tags: ['dinner', 'thai', 'curry', 'coconut'],
                    ingredients: [
                        '2-3 tbsp green curry paste',
                        '1 can (14oz) coconut milk',
                        '1 lb chicken thigh, cut in pieces',
                        '2 tbsp fish sauce',
                        '1 tbsp palm sugar or brown sugar',
                        '4 Thai eggplants, quartered',
                        '1 red bell pepper, sliced',
                        '1/4 cup Thai basil leaves',
                        '2 kaffir lime leaves',
                        '1 long red chili, sliced',
                        'Jasmine rice for serving'
                    ],
                    instructions: [
                        'Heat thick coconut cream in wok over medium heat',
                        'Fry curry paste 2-3 minutes until fragrant',
                        'Add chicken, cook until nearly done',
                        'Add remaining coconut milk, bring to gentle simmer',
                        'Season with fish sauce and sugar',
                        'Add eggplant and bell pepper, cook 5-7 minutes',
                        'Stir in basil and lime leaves',
                        'Garnish with chili slices, serve over rice'
                    ],
                    nutritionHighlights: ['Authentic Thai', 'Dairy Free', 'Gluten Free'],
                    tips: 'Use authentic curry paste from Asian market for best flavor. Adjust spice level with more/less paste.'
                }
            ],
            'beef': [
                {
                    id: `premium_${Date.now()}_5`,
                    name: 'Classic Beef Stroganoff',
                    source: 'Food Network',
                    rating: 4.6,
                    difficulty: 'Medium',
                    time: '40 min',
                    servings: 6,
                    image: '🥩',
                    tags: ['dinner', 'comfort', 'beef', 'creamy'],
                    ingredients: [
                        '2 lbs beef sirloin, cut in strips',
                        '1 lb egg noodles',
                        '1 large onion, sliced',
                        '1 lb mushrooms, sliced',
                        '3 cloves garlic, minced',
                        '3 tbsp flour',
                        '2 cups beef broth',
                        '1 cup sour cream',
                        '2 tbsp Dijon mustard',
                        '3 tbsp butter',
                        'Fresh parsley for garnish'
                    ],
                    instructions: [
                        'Cook egg noodles according to package directions',
                        'Season beef strips with salt and pepper',
                        'Sear beef in batches in hot skillet, set aside',
                        'Sauté onions and mushrooms until golden',
                        'Add garlic, cook 1 minute',
                        'Sprinkle in flour, cook 2 minutes',
                        'Gradually add beef broth, stirring constantly',
                        'Return beef to pan, simmer 10 minutes',
                        'Stir in sour cream and mustard, heat through',
                        'Serve over noodles, garnish with parsley'
                    ],
                    nutritionHighlights: ['High Protein', 'Comfort Food', 'Family Favorite'],
                    tips: 'Don\'t boil after adding sour cream or it will curdle. Use tender cuts of beef for best results.'
                }
            ],
            'fish': [
                {
                    id: `premium_${Date.now()}_6`,
                    name: 'Fish Tacos with Mango Salsa',
                    source: 'Bon Appétit',
                    rating: 4.7,
                    difficulty: 'Easy',
                    time: '25 min',
                    servings: 4,
                    image: '🌮',
                    tags: ['dinner', 'mexican', 'fresh', 'healthy'],
                    ingredients: [
                        '1.5 lbs white fish (mahi-mahi or cod)',
                        '8 corn tortillas',
                        '1 ripe mango, diced',
                        '1/2 red onion, finely diced',
                        '1 jalapeño, minced',
                        '1/4 cup cilantro, chopped',
                        '2 limes, juiced',
                        '2 cups cabbage, shredded',
                        '1/2 cup crema or sour cream',
                        '1 tsp chili powder',
                        '1/2 tsp cumin',
                        'Salt and pepper'
                    ],
                    instructions: [
                        'Mix mango, onion, jalapeño, cilantro, and half the lime juice',
                        'Season fish with chili powder, cumin, salt, and pepper',
                        'Grill or pan-sear fish 3-4 minutes per side',
                        'Warm tortillas in dry skillet',
                        'Flake fish into bite-sized pieces',
                        'Fill tortillas with fish, cabbage, and mango salsa',
                        'Drizzle with crema and remaining lime juice',
                        'Serve immediately with lime wedges'
                    ],
                    nutritionHighlights: ['High Protein', 'Fresh & Light', 'Omega-3'],
                    tips: 'Don\'t overcook the fish - it should flake easily. Fresh mango makes all the difference.'
                }
            ]
        };

        const searchTerm = query.toLowerCase();
        let results = [];

        // Search through categories
        Object.keys(premiumRecipes).forEach(category => {
            if (searchTerm.includes(category) || category.includes(searchTerm)) {
                results.push(...premiumRecipes[category]);
            }
        });

        // Search individual recipes
        Object.values(premiumRecipes).flat().forEach(recipe => {
            if (recipe.name.toLowerCase().includes(searchTerm) || 
                recipe.tags.some(tag => tag.includes(searchTerm))) {
                if (!results.find(r => r.id === recipe.id)) {
                    results.push(recipe);
                }
            }
        });

        return results;
    }

    // Backup Recipe Search (Community sources with good ratings)
    async searchBackupRecipes(query) {
        // Simulate backup recipe sources (AllRecipes, etc.)
        const backupRecipes = [
            {
                id: `backup_${Date.now()}_1`,
                name: 'Simple Spaghetti Bolognese',
                source: 'AllRecipes',
                rating: 4.5,
                difficulty: 'Easy',
                time: '45 min',
                servings: 4,
                image: '🍝',
                tags: ['dinner', 'italian', 'meat sauce', 'comfort'],
                ingredients: [
                    '1 lb ground beef',
                    '1 onion, diced',
                    '2 cloves garlic, minced',
                    '1 can (28oz) crushed tomatoes',
                    '2 tbsp tomato paste',
                    '1/2 cup red wine (optional)',
                    '1 tsp dried basil',
                    '1 tsp dried oregano',
                    '1 lb spaghetti',
                    'Parmesan cheese for serving'
                ],
                instructions: [
                    'Brown ground beef in large pot',
                    'Add onion and garlic, cook until soft',
                    'Stir in tomato paste, cook 1 minute',
                    'Add crushed tomatoes, wine, herbs',
                    'Simmer 30 minutes, stirring occasionally',
                    'Cook spaghetti according to package directions',
                    'Serve sauce over pasta with Parmesan'
                ],
                nutritionHighlights: ['High Protein', 'Classic Comfort'],
                tips: 'Let sauce simmer low and slow for best flavor development'
            }
        ];

        return backupRecipes.filter(recipe => 
            recipe.name.toLowerCase().includes(query.toLowerCase()) ||
            recipe.tags.some(tag => tag.includes(query.toLowerCase()))
        );
    }

    // Built-in Recipe Database (Fallback)
    searchBuiltInRecipes(query) {
        const builtInRecipes = this.getDefaultRecipes();
        return builtInRecipes.filter(recipe =>
            recipe.name.toLowerCase().includes(query.toLowerCase()) ||
            recipe.tags.some(tag => tag.includes(query.toLowerCase())) ||
            recipe.ingredients.some(ingredient => 
                ingredient.toLowerCase().includes(query.toLowerCase())
            )
        );
    }

    getDefaultRecipes() {
        return [
            {
                id: 'default-1',
                name: 'Quick Chicken Stir Fry',
                source: 'Family Recipe',
                rating: 4.3,
                difficulty: 'Easy',
                time: '20 min',
                servings: 4,
                image: '🍗',
                tags: ['dinner', 'quick', 'asian', 'vegetables'],
                ingredients: [
                    '1 lb chicken breast, sliced thin',
                    '2 cups mixed vegetables',
                    '3 tbsp soy sauce',
                    '2 tbsp vegetable oil',
                    '1 tbsp cornstarch',
                    '2 cloves garlic, minced',
                    '1 tbsp fresh ginger, minced',
                    'Rice for serving'
                ],
                instructions: [
                    'Heat oil in wok or large skillet',
                    'Add chicken, cook until almost done',
                    'Add garlic and ginger, cook 30 seconds',
                    'Add vegetables, stir-fry 3-4 minutes',
                    'Mix soy sauce and cornstarch, add to pan',
                    'Stir until sauce thickens',
                    'Serve over rice'
                ],
                nutritionHighlights: ['High Protein', 'Quick & Easy'],
                tips: 'Have all ingredients prepped before starting - this cooks fast!'
            }
        ];
    }

    init() {
        this.renderApp();
        this.attachEventListeners();
        
        // Check if user profile exists, if not show setup
        if (!this.userProfile) {
            this.showProfileSetup();
        } else {
            this.showTab(this.currentTab);
        }
    }

    showProfileSetup() {
        // Create a simple inline profile setup instead of persistent modal
        const content = document.getElementById('tab-content');
        content.innerHTML = `
            <div class="section text-center">
                <div style="max-width: 500px; margin: 0 auto;">
                    <h2 class="section-title">🍽️ Welcome to Your Family Meal Planner!</h2>
                    <p class="section-subtitle">Let's set up your profile to get started</p>
                    
                    <form id="profile-setup-form" style="text-align: left; margin-top: 2rem;">
                        <div class="form-group">
                            <label class="form-label">Family Name *</label>
                            <input type="text" class="form-input" name="familyName" placeholder="The Smith Family" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Number of Family Members</label>
                            <select class="form-select" name="familySize">
                                <option value="2">2 people</option>
                                <option value="3">3 people</option>
                                <option value="4" selected>4 people</option>
                                <option value="5">5 people</option>
                                <option value="6+">6+ people</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Preferred Grocery Store (Optional)</label>
                            <select class="form-select" name="preferredStore">
                                <option value="">Select a store</option>
                                <option value="kroger">Kroger</option>
                                <option value="safeway">Safeway</option>
                                <option value="whole-foods">Whole Foods</option>
                                <option value="trader-joes">Trader Joe's</option>
                                <option value="walmart">Walmart</option>
                                <option value="target">Target</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Dietary Preferences (Optional)</label>
                            <input type="text" class="form-input" name="dietary" placeholder="Vegetarian, Gluten-free, etc.">
                        </div>
                        <div style="text-align: center; margin-top: 2rem;">
                            <button type="submit" class="btn btn-primary btn-lg">
                                🚀 Start Meal Planning!
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Handle profile setup form
        document.getElementById('profile-setup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            this.userProfile = {
                familyName: formData.get('familyName'),
                familySize: formData.get('familySize'),
                preferredStore: formData.get('preferredStore'),
                dietary: formData.get('dietary'),
                createdAt: new Date().toISOString()
            };
            
            this.saveData();
            this.showNotification(`🎉 Welcome ${this.userProfile.familyName}! Your meal planner is ready!`);
            this.showTab('dashboard');
        });
    }

    renderApp() {
        document.body.innerHTML = `
            <div class="app">
                <header class="header">
                    <div class="container">
                        <div class="header-content">
                            <div class="logo">
                                <span class="logo-icon">🍽️</span>
                                <span>Family Meal Planner</span>
                            </div>
                            <div class="header-actions">
                                <div class="user-profile">
                                    <div class="avatar">${this.userProfile ? this.userProfile.familyName.split(' ')[0].substring(0, 2).toUpperCase() : 'FM'}</div>
                                    <span>${this.userProfile ? this.userProfile.familyName : 'Family Manager'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <nav class="nav-tabs">
                    <div class="container">
                        <ul class="tab-list">
                            <li class="tab-item">
                                <button class="tab-button active" data-tab="dashboard">
                                    📊 Dashboard
                                </button>
                            </li>
                            <li class="tab-item">
                                <button class="tab-button" data-tab="planning">
                                    📅 Planning
                                </button>
                            </li>
                            <li class="tab-item">
                                <button class="tab-button" data-tab="recipes">
                                    📚 Recipes
                                </button>
                            </li>
                            <li class="tab-item">
                                <button class="tab-button" data-tab="shopping">
                                    🛒 Shopping
                                </button>
                            </li>
                            <li class="tab-item">
                                <button class="tab-button" data-tab="schedule">
                                    ⏰ Schedule
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main class="main">
                    <div class="container">
                        <div id="tab-content"></div>
                    </div>
                </main>
            </div>

            <!-- Recipe Search Modal -->
            <div id="recipe-search-modal" class="modal-overlay hidden">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">🔍 Find Recipe</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="search-container">
                            <span class="search-icon">🔍</span>
                            <input 
                                type="text" 
                                id="recipe-search-input" 
                                class="search-input" 
                                placeholder="Search for chicken parmesan, thai curry, pasta..."
                            />
                        </div>
                        <div id="recipe-search-results" class="recipe-grid mt-lg">
                            <div class="loading">
                                <div class="spinner"></div>
                                <span>Ready to search...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Manual Recipe Modal -->
            <div id="manual-recipe-modal" class="modal-overlay hidden">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">✍️ Add Recipe Manually</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="manual-recipe-form">
                            <div class="form-group">
                                <label class="form-label">Recipe Name *</label>
                                <input type="text" class="form-input" name="name" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Emoji/Image</label>
                                <input type="text" class="form-input" name="image" placeholder="🍝">
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="form-group">
                                    <label class="form-label">Prep Time</label>
                                    <input type="text" class="form-input" name="time" placeholder="30 min">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Servings</label>
                                    <input type="number" class="form-input" name="servings" placeholder="4">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Ingredients (one per line) *</label>
                                <textarea class="form-textarea" name="ingredients" required 
                                    placeholder="1 lb chicken breast&#10;2 cups pasta&#10;1 jar marinara sauce"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Instructions (one step per line) *</label>
                                <textarea class="form-textarea" name="instructions" required 
                                    placeholder="Cook pasta according to package directions&#10;Season and cook chicken&#10;Combine with sauce"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Tags (comma separated)</label>
                                <input type="text" class="form-input" name="tags" placeholder="dinner, italian, quick">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-ghost" id="cancel-manual-recipe">Cancel</button>
                        <button type="submit" form="manual-recipe-form" class="btn btn-primary">
                            ✅ Save Recipe
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.showTab(tab);
            });
        });

        // Recipe search functionality
        const searchInput = document.getElementById('recipe-search-input');
        const searchResults = document.getElementById('recipe-search-results');
        let searchTimeout;

        if (searchInput && searchResults) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                
                if (query.length < 2) {
                    searchResults.innerHTML = `
                        <div class="loading">
                            <div class="spinner"></div>
                            <span>Type at least 2 characters to search...</span>
                        </div>
                    `;
                    return;
                }

                searchResults.innerHTML = `
                    <div class="loading">
                        <div class="spinner"></div>
                        <span>Searching premium recipe sources...</span>
                    </div>
                `;

                searchTimeout = setTimeout(async () => {
                    try {
                        const recipes = await this.searchRecipes(query);
                        this.displaySearchResults(recipes, searchResults);
                    } catch (error) {
                        searchResults.innerHTML = `
                            <div class="text-center p-xl">
                                <p>Search temporarily unavailable. Please try again.</p>
                            </div>
                        `;
                    }
                }, 300);
            });
        }

        // Modal controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || 
                e.target.classList.contains('modal-close') ||
                e.target.id === 'cancel-manual-recipe') {
                this.closeAllModals();
            }
        });

        // Manual recipe form
        const manualForm = document.getElementById('manual-recipe-form');
        if (manualForm) {
            manualForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addManualRecipe(new FormData(e.target));
            });
        }
    }

    displaySearchResults(recipes, container) {
        if (recipes.length === 0) {
            container.innerHTML = `
                <div class="text-center p-xl">
                    <p>No recipes found. Try a different search term or add your recipe manually.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recipes.map(recipe => `
            <div class="recipe-card" data-recipe='${JSON.stringify(recipe)}'>
                <div class="recipe-emoji">${recipe.image}</div>
                <div class="recipe-title">${recipe.name}</div>
                <div class="recipe-meta">
                    <div><strong>Source:</strong> ${recipe.source}</div>
                    <div><strong>Rating:</strong> ⭐ ${recipe.rating}</div>
                    <div><strong>Time:</strong> ${recipe.time} • <strong>Serves:</strong> ${recipe.servings}</div>
                    <div><strong>Difficulty:</strong> ${recipe.difficulty}</div>
                </div>
                <div class="recipe-tags">
                    ${recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div style="margin-top: 1rem;">
                    <button class="btn btn-primary btn-sm" onclick="mealPlanner.addRecipeFromSearch(this)">
                        ✅ Add to Collection
                    </button>
                </div>
            </div>
        `).join('');
    }

    addRecipeFromSearch(button) {
        const recipeData = JSON.parse(button.closest('.recipe-card').dataset.recipe);
        
        // Add to our collection
        this.recipes.push({
            ...recipeData,
            id: `recipe_${Date.now()}`,
            dateAdded: new Date().toISOString()
        });
        
        this.saveData();
        this.closeAllModals();
        this.showTab('recipes');
        
        // Show success message
        this.showNotification(`✅ "${recipeData.name}" added to your recipe collection!`);
    }

    addManualRecipe(formData) {
        const recipe = {
            id: `recipe_${Date.now()}`,
            name: formData.get('name'),
            image: formData.get('image') || '🍽️',
            time: formData.get('time') || 'Unknown',
            servings: parseInt(formData.get('servings')) || 4,
            source: 'Family Recipe',
            rating: 0,
            difficulty: 'Unknown',
            ingredients: formData.get('ingredients').split('\n').map(i => i.trim()).filter(i => i),
            instructions: formData.get('instructions').split('\n').map(i => i.trim()).filter(i => i),
            tags: formData.get('tags').split(',').map(t => t.trim()).filter(t => t),
            dateAdded: new Date().toISOString()
        };

        this.recipes.push(recipe);
        this.saveData();
        this.closeAllModals();
        this.showTab('recipes');
        this.showNotification(`✅ "${recipe.name}" added to your collection!`);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    showTab(tabName) {
        // Don't show tabs if profile isn't set up yet
        if (!this.userProfile && tabName !== 'dashboard') {
            return;
        }

        // Update active tab
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        this.currentTab = tabName;

        // Render tab content
        const content = document.getElementById('tab-content');
        if (!content) return;

        switch(tabName) {
            case 'dashboard':
                content.innerHTML = this.renderDashboard();
                break;
            case 'planning':
                content.innerHTML = this.renderPlanning();
                break;
            case 'recipes':
                content.innerHTML = this.renderRecipes();
                this.attachRecipeEvents();
                break;
            case 'shopping':
                content.innerHTML = this.renderShopping();
                break;
            case 'schedule':
                content.innerHTML = this.renderSchedule();
                break;
        }
    }

    renderDashboard() {
        // If no profile, show setup
        if (!this.userProfile) {
            return '';  // Profile setup will be shown by init()
        }

        const totalRecipes = this.recipes.length;
        const plannedMeals = Object.keys(this.mealPlans).length;
        const recentRecipes = this.recipes.slice(-3);

        return `
            <div class="section">
                <div class="section-header">
                    <div>
                        <h2 class="section-title">📊 ${this.userProfile.familyName} Kitchen Dashboard</h2>
                        <p class="section-subtitle">Your meal planning command center</p>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <span class="stat-number">${totalRecipes}</span>
                        <div class="stat-label">Family Recipes</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">${plannedMeals}</span>
                        <div class="stat-label">Meals Planned</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">${this.userProfile.familySize}</span>
                        <div class="stat-label">Family Members</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">4.7</span>
                        <div class="stat-label">Avg Rating</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">🍽️ This Week's Meals</h3>
                        </div>
                        <div class="card-body">
                            <p>No meals planned for this week yet.</p>
                            <button class="btn btn-primary mt-md" onclick="mealPlanner.showTab('planning')">
                                Plan This Week
                            </button>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">📚 Recent Recipes</h3>
                        </div>
                        <div class="card-body">
                            ${recentRecipes.length > 0 ? 
                                recentRecipes.map(recipe => `
                                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                        <span>${recipe.image}</span>
                                        <span>${recipe.name}</span>
                                    </div>
                                `).join('') :
                                '<p>No recipes added yet.</p>'
                            }
                            <button class="btn btn-secondary mt-md" onclick="mealPlanner.showTab('recipes')">
                                View All Recipes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderRecipes() {
        return `
            <div class="section">
                <div class="section-header">
                    <div>
                        <h2 class="section-title">📚 Recipe Collection</h2>
                        <p class="section-subtitle">Your family's favorite meals</p>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button class="btn btn-primary" id="search-recipe-btn">
                            🔍 Find Recipe
                        </button>
                        <button class="btn btn-secondary" id="add-manual-recipe-btn">
                            ✍️ Enter Manually
                        </button>
                    </div>
                </div>

                <div class="recipe-grid">
                    ${this.recipes.map(recipe => `
                        <div class="recipe-card">
                            <div class="recipe-emoji">${recipe.image}</div>
                            <h3 class="recipe-title">${recipe.name}</h3>
                            <div class="recipe-meta">
                                <div><strong>Source:</strong> ${recipe.source}</div>
                                ${recipe.rating ? `<div><strong>Rating:</strong> ⭐ ${recipe.rating}</div>` : ''}
                                <div><strong>Time:</strong> ${recipe.time} • <strong>Serves:</strong> ${recipe.servings}</div>
                            </div>
                            <div class="recipe-tags">
                                ${recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    attachRecipeEvents() {
        const searchBtn = document.getElementById('search-recipe-btn');
        const manualBtn = document.getElementById('add-manual-recipe-btn');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                document.getElementById('recipe-search-modal').classList.remove('hidden');
                const searchInput = document.getElementById('recipe-search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            });
        }

        if (manualBtn) {
            manualBtn.addEventListener('click', () => {
                document.getElementById('manual-recipe-modal').classList.remove('hidden');
            });
        }
    }

    renderPlanning() {
        return `
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">📅 Weekly Meal Planning</h2>
                    <p class="section-subtitle">Plan your family's meals for the week</p>
                </div>
                <p>Meal planning interface coming soon...</p>
            </div>
        `;
    }

    renderShopping() {
        return `
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">🛒 Shopping Lists</h2>
                    <p class="section-subtitle">Organized grocery lists for your meal plans</p>
                </div>
                <p>Shopping list generator coming soon...</p>
            </div>
        `;
    }

    renderSchedule() {
        return `
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">⏰ Meal Schedule</h2>
                    <p class="section-subtitle">Automated meal planning reminders</p>
                </div>
                <p>Scheduling automation coming soon...</p>
            </div>
        `;
    }

    saveData() {
        localStorage.setItem('mealPlannerRecipes', JSON.stringify(this.recipes));
        localStorage.setItem('mealPlannerPlans', JSON.stringify(this.mealPlans));
        localStorage.setItem('mealPlannerShopping', JSON.stringify(this.shoppingLists));
        if (this.userProfile) {
            localStorage.setItem('mealPlannerProfile', JSON.stringify(this.userProfile));
        }
    }
}

// Initialize the app when page loads
let mealPlanner;
document.addEventListener('DOMContentLoaded', () => {
    mealPlanner = new FamilyMealPlanner();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
