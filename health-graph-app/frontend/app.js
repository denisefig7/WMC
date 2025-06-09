let appState = {
  nutritionSearches: 0,
  exercisesViewed: 0,
  quotesViewed: 0,
  currentSection: 'dashboard'
};

document.addEventListener('DOMContentLoaded', () => {
  updateDashboard();
  loadJournalEntry();
  setTimeout(getMotivationalQuote, 2000);
});

function showSection(sectionName) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(sectionName).classList.add('active');
  const tab = Array.from(document.querySelectorAll('.nav-tab')).find(t => t.textContent.toLowerCase().includes(sectionName));
  if (tab) tab.classList.add('active');
  appState.currentSection = sectionName;
}

function searchNutrition() {
  const foodName = document.getElementById('foodSearch').value.trim();
  const resultsDiv = document.getElementById('nutritionResults');
  if (!foodName) {
    resultsDiv.innerHTML = '<div class="error">Please enter a food name</div>';
    return;
  }
  resultsDiv.innerHTML = '<div class="loading">Searching nutrition data...</div>';
  getRealNutritionData(foodName)
    .then(data => data || getEnhancedMockNutritionData(foodName))
    .then(data => {
      if (!data) {
        resultsDiv.innerHTML = '<div class="error">No data found for this food item</div>';
        return;
      }
      displayNutritionResults(data, foodName);
      appState.nutritionSearches++;
      updateDashboard();
    })
    .catch(e => {
      resultsDiv.innerHTML = '<div class="error">Error fetching nutrition data</div>';
      console.error(e);
    });
}

function getRealNutritionData(foodName) {
  return fetch(API_CONFIG.nutritionAPI.baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': API_CONFIG.nutritionAPI.appId,
      'x-app-key': API_CONFIG.nutritionAPI.appKey
    },
    body: JSON.stringify({ query: foodName })
  })
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      if (!data?.foods?.[0]) return null;
      const item = data.foods[0];
      return {
        calories: Math.round(item.nf_calories || 0),
        protein: +(item.nf_protein || 0).toFixed(1),
        carbs: +(item.nf_total_carbohydrate || 0).toFixed(1),
        fat: +(item.nf_total_fat || 0).toFixed(1),
        fiber: +(item.nf_dietary_fiber || 0).toFixed(1),
        sugar: +(item.nf_sugars || 0).toFixed(1),
        source: 'Nutritionix API'
      };
    })
    .catch(() => null);
}

function getEnhancedMockNutritionData(foodName) {
  const db = {
    apple: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4, sugar: 19 },
    banana: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3, sugar: 14 },
    chicken: { calories: 231, protein: 43.5, carbs: 0, fat: 5, fiber: 0, sugar: 0 },
    broccoli: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sugar: 1.5 },
    rice: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1 },
    salmon: { calories: 208, protein: 22.1, carbs: 0, fat: 12.4, fiber: 0, sugar: 0 },
    spinach: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4 },
    oats: { calories: 389, protein: 16.9, carbs: 66, fat: 6.9, fiber: 10.6, sugar: 0.99 },
    egg: { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1 },
    yogurt: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, sugar: 3.2 }
  };
  const item = db[foodName.toLowerCase()];
  return Promise.resolve(item ? { ...item, source: 'Built-in Database' } : null);
}

function displayNutritionResults(data, name) {
  document.getElementById('nutritionResults').innerHTML = `
    <div class="card">
      <h3>Nutrition Information for ${name.charAt(0).toUpperCase() + name.slice(1)}</h3>
      <div class="nutrition-info">
        <div class="nutrition-item"><strong>${data.calories}</strong><span>Calories</span></div>
        <div class="nutrition-item"><strong>${data.protein}g</strong><span>Protein</span></div>
        <div class="nutrition-item"><strong>${data.carbs}g</strong><span>Carbs</span></div>
        <div class="nutrition-item"><strong>${data.fat}g</strong><span>Fat</span></div>
        <div class="nutrition-item"><strong>${data.fiber}g</strong><span>Fiber</span></div>
        <div class="nutrition-item"><strong>${data.sugar}g</strong><span>Sugar</span></div>
      </div>
      <p style="margin-top: 15px; font-size: 0.9em; color: #666;">Source: ${data.source}</p>
    </div>`;
}

async function searchExercises() {
  const category = document.getElementById('exerciseCategory').value.toLowerCase();
  const resultsDiv = document.getElementById('exerciseResults');

  if (!category) {
    resultsDiv.innerHTML = '<div class="error">Please select a muscle group</div>';
    return;
  }

  resultsDiv.innerHTML = '<div class="loading">Fetching exercises...</div>';

  try {
    const exercises = await getWgerExerciseData(category);
    if (!exercises || exercises.length === 0) throw new Error();

    displayExerciseResults(exercises);
    appState.exercisesViewed += exercises.length;
    updateDashboard();
  } catch {
    const mockExercises = getMockExerciseData(category);
    displayExerciseResults(mockExercises);
    appState.exercisesViewed += mockExercises.length;
    updateDashboard();
  }
}

async function getWgerExerciseData(muscleGroup) {
  const muscleMap = {
    abdominals: 6, biceps: 1, chest: 4, glutes: 8, hamstrings: 12,
    quadriceps: 10, triceps: 5, calves: 7, back: 2, shoulders: 13
  };

  const muscleId = muscleMap[muscleGroup];
  if (!muscleId) {
    console.warn("Unknown muscle group:", muscleGroup);
    return [];
  }

  try {
   const response = await fetch(`${API_CONFIG.exerciseAPI.baseUrl}?muscles=${muscleId}&language=2&limit=10`, {
      headers: API_CONFIG.exerciseAPI.headers
    });

    console.log("WGER response:", response);

    if (!response.ok) throw new Error("WGER fetch failed");

    const data = await response.json();
    console.log("WGER data:", data);

    const exercises = data.results
      .filter(ex => ex.name?.trim())
      .map(ex => ({
        name: ex.name,
        instructions: ex.description || 'No description provided.',
        equipment: 'Not specified'
      }));

    return exercises.slice(0, 6);
  } catch (err) {
    console.error("WGER API error:", err);
    throw err;
  }
}

function getMockExerciseData(group) {
  const db = {
    abdominals: [
      { name: 'Plank', instructions: 'Hold a straight line...', equipment: 'Bodyweight' },
      { name: 'Crunches', instructions: 'Lie on your back...', equipment: 'Bodyweight' },
      { name: 'Russian Twists', instructions: 'Sit with knees bent...', equipment: 'Bodyweight' },
      { name: 'Mountain Climbers', instructions: 'Start in plank...', equipment: 'Bodyweight' }
    ],
    biceps: [
      { name: 'Bicep Curls', instructions: 'Hold weights...', equipment: 'Dumbbells' },
      { name: 'Hammer Curls', instructions: 'Hold weights...', equipment: 'Dumbbells' },
      { name: 'Chin-ups', instructions: 'Hang from bar...', equipment: 'Pull-up bar' },
      { name: 'Concentration Curls', instructions: 'Sit with elbow...', equipment: 'Dumbbell' }
    ],
    chest: [
      { name: 'Push-ups', instructions: 'Lower chest...', equipment: 'Bodyweight' },
      { name: 'Bench Press', instructions: 'Lie on bench...', equipment: 'Barbell' },
      { name: 'Chest Flyes', instructions: 'Lie on bench...', equipment: 'Dumbbells' },
      { name: 'Incline Push-ups', instructions: 'Hands elevated...', equipment: 'Bench' }
    ],
    back: [
      { name: 'Pull-ups', instructions: 'Hang from bar...', equipment: 'Pull-up bar' },
      { name: 'Bent-over Rows', instructions: 'Bend at hips...', equipment: 'Dumbbells' },
      { name: 'Lat Pulldowns', instructions: 'Sit at machine...', equipment: 'Cable machine' },
      { name: 'Superman', instructions: 'Lie face down...', equipment: 'Bodyweight' }
    ],
    shoulders: [
      { name: 'Shoulder Press', instructions: 'Press weights...', equipment: 'Dumbbells' },
      { name: 'Lateral Raises', instructions: 'Raise weights...', equipment: 'Dumbbells' },
      { name: 'Front Raises', instructions: 'Raise weights forward...', equipment: 'Dumbbells' },
      { name: 'Pike Push-ups', instructions: 'Start in downward dog...', equipment: 'Bodyweight' }
    ],
    quadriceps: [
      { name: 'Squats', instructions: 'Lower hips...', equipment: 'Bodyweight' },
      { name: 'Lunges', instructions: 'Step forward...', equipment: 'Bodyweight' },
      { name: 'Wall Sits', instructions: 'Lean against wall...', equipment: 'Wall' },
      { name: 'Jump Squats', instructions: 'Perform squat...', equipment: 'Bodyweight' }
    ],
    hamstrings: [
      { name: 'Romanian Deadlifts', instructions: 'Hinge at hips...', equipment: 'Dumbbells' },
      { name: 'Glute Bridges', instructions: 'Lie on back...', equipment: 'Bodyweight' },
      { name: 'Leg Curls', instructions: 'Lie face down...', equipment: 'Resistance band' },
      { name: 'Single Leg Deadlifts', instructions: 'Stand on one leg...', equipment: 'Bodyweight' }
    ],
    glutes: [
      { name: 'Hip Thrusts', instructions: 'Drive hips up...', equipment: 'Bodyweight' },
      { name: 'Clamshells', instructions: 'Lie on side...', equipment: 'Bodyweight' },
      { name: 'Fire Hydrants', instructions: 'On hands and knees...', equipment: 'Bodyweight' },
      { name: 'Glute Bridges', instructions: 'Lie on back...', equipment: 'Bodyweight' }
    ],
    calves: [
      { name: 'Calf Raises', instructions: 'Rise up on toes...', equipment: 'Bodyweight' },
      { name: 'Single Leg Calf Raises', instructions: 'Same as calf raises...', equipment: 'Bodyweight' },
      { name: 'Seated Calf Raises', instructions: 'Sit with weight...', equipment: 'Weight plate' },
      { name: 'Jump Rope', instructions: 'Bounce on balls...', equipment: 'Jump rope' }
    ],
    triceps: [
      { name: 'Tricep Dips', instructions: 'Lower body...', equipment: 'Chair/Bench' },
      { name: 'Overhead Extension', instructions: 'Hold weight overhead...', equipment: 'Dumbbell' },
      { name: 'Close-grip Push-ups', instructions: 'Push-ups with hands...', equipment: 'Bodyweight' },
      { name: 'Diamond Push-ups', instructions: 'Hands form diamond...', equipment: 'Bodyweight' }
    ]
  };
  return db[group] || [];
}

function displayExerciseResults(exercises) {
  if (!exercises || exercises.length === 0) {
    document.getElementById('exerciseResults').innerHTML = '<div class="error">No exercises found for this muscle group.</div>';
    return;
  }

  const html = exercises.map(e => `
    <div class="exercise-card">
      <h4>${e.name}</h4>
      <p>${e.instructions}</p>
      <p class="equipment"><strong>Equipment:</strong> ${e.equipment}</p>
    </div>`).join('');
  
  document.getElementById('exerciseResults').innerHTML = `<div class="exercise-grid">${html}</div>`;
}

function getMotivationalQuote() {
  fetch(API_CONFIG.quotesAPI.baseUrl)
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      if (data && (data[0] || data.content)) {
        const quote = Array.isArray(data) ? data[0] : data;
        displayQuote(quote.q || quote.content, quote.a || quote.author);
      } else {
        const localQuotes = getLocalQuotes();
        const randomQuote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
        displayQuote(randomQuote.text, randomQuote.author);
      }
      appState.quotesViewed++;
      updateDashboard();
    })
    .catch(err => {
      console.error("Quote fetch error:", err);
      const localQuotes = getLocalQuotes();
      const randomQuote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
      displayQuote(randomQuote.text, randomQuote.author);
      appState.quotesViewed++;
      updateDashboard();
    });
}

function getLocalQuotes() {
  return [
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
    { text: "Your body can do it. It's your mind you have to convince.", author: "Unknown" },
    { text: "Health is not about the weight you lose, but about the life you gain.", author: "Unknown" },
    { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
    { text: "A healthy outside starts from the inside.", author: "Robert Urich" },
    { text: "The groundwork for all happiness is good health.", author: "Leigh Hunt" },
    { text: "To keep the body in good health is a duty, for otherwise we shall not be able to trim the lamp of wisdom.", author: "Buddha" },
    { text: "Health is wealth.", author: "Unknown" },
    { text: "An apple a day keeps the doctor away.", author: "Proverb" },
    { text: "Exercise is medicine.", author: "Unknown" }
  ];
}

function displayQuote(text, author) {
  document.getElementById('quoteResults').innerHTML = `
    <div class="quote-card">
      <div class="quote-text">"${text}"</div>
      <div class="quote-author">— ${author}</div>
    </div>`;
}

// Journal Functions
function saveJournalEntry() {
  const entry = document.getElementById('journalEntry').value;
  if (!entry.trim()) {
    document.getElementById('journalFeedback').innerHTML = '<div class="error">Please write something first!</div>';
    setTimeout(() => document.getElementById('journalFeedback').innerHTML = '', 2000);
    return;
  }
  
  window.journalData = { 
    entry: entry, 
    date: new Date().toISOString() 
  };
  
  document.getElementById('journalFeedback').innerHTML = '<div class="success">Journal entry saved!</div>';
  setTimeout(() => document.getElementById('journalFeedback').innerHTML = '', 2000);
}

function loadJournalEntry() {
  if (window.journalData) {
    document.getElementById('journalEntry').value = window.journalData.entry;
    const date = new Date(window.journalData.date).toLocaleDateString();
    document.getElementById('journalFeedback').innerHTML = `<div class="success">Loaded entry from ${date}</div>`;
    setTimeout(() => document.getElementById('journalFeedback').innerHTML = '', 3000);
  }
}

function clearJournalEntry() {
  document.getElementById('journalEntry').value = '';
  document.getElementById('journalFeedback').innerHTML = '<div class="success">Journal cleared!</div>';
  setTimeout(() => document.getElementById('journalFeedback').innerHTML = '', 2000);
}

// Dashboard Functions
function updateDashboard() {
  document.getElementById('totalSearches').textContent = appState.nutritionSearches;
  document.getElementById('totalExercises').textContent = appState.exercisesViewed;
  document.getElementById('totalQuotes').textContent = appState.quotesViewed;
}

// Event Listeners
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && document.activeElement.id === 'foodSearch') {
    searchNutrition();
  }
});
