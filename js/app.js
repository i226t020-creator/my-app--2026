import { storage } from './storage.js';

// DOM Elements
const currentWeightEl = document.getElementById('current-weight');
const weightDiffEl = document.getElementById('weight-diff');
const toGoalEl = document.getElementById('to-goal');
const goalProgressEl = document.getElementById('goal-progress');
const entryForm = document.getElementById('entry-form');
const foodForm = document.getElementById('food-form');
const historyList = document.getElementById('history-list');
const foodHistoryList = document.getElementById('food-history-list');
const btnSettings = document.getElementById('btn-settings');
const modalSettings = document.getElementById('modal-settings');
const closeModal = document.querySelector('.close-modal');
const goalForm = document.getElementById('goal-form');
const btnExport = document.getElementById('btn-export');
const btnImportTrigger = document.getElementById('btn-import-trigger');
const importFile = document.getElementById('import-file');

// Chart instance
let weightChart = null;

/**
 * Initialize the application
 */
function init() {
    const data = storage.getData();
    
    // Set default date in forms to today
    const now = new Date();
    document.getElementById('date').valueAsDate = now;
    document.getElementById('food-date').valueAsDate = now;
    
    // Set default time to current time
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                        now.getMinutes().toString().padStart(2, '0');
    document.getElementById('food-time').value = currentTime;

    // Populate goal form if goal exists
    if (data.goal) {
        document.getElementById('start-weight').value = data.goal.startWeight;
        document.getElementById('target-weight').value = data.goal.targetWeight;
    }

    renderDashboard();
    renderHistory();
    renderFoodHistory();
    initChart();
    setupEventListeners();
}

/**
 * Render dashboard stats
 */
function renderDashboard() {
    const data = storage.getData();
    const entries = data.entries;
    const goal = data.goal;

    if (entries.length > 0) {
        const current = entries[entries.length - 1].weight;
        currentWeightEl.textContent = current.toFixed(1);

        if (entries.length > 1) {
            const previous = entries[entries.length - 2].weight;
            const diff = current - previous;
            weightDiffEl.textContent = `${diff > 0 ? '+' : ''}${diff.toFixed(1)} kg (前回比)`;
            weightDiffEl.className = `stat-diff ${diff > 0 ? 'positive' : 'negative'}`;
        }
    }

    if (goal && entries.length > 0) {
        const current = entries[entries.length - 1].weight;
        const diffToGoal = current - goal.targetWeight;
        toGoalEl.textContent = Math.abs(diffToGoal).toFixed(1);

        // Progress calculation
        const totalToLose = goal.startWeight - goal.targetWeight;
        const lostSoFar = goal.startWeight - current;
        let progress = (lostSoFar / totalToLose) * 100;
        progress = Math.max(0, Math.min(100, progress)); // clamp 0-100
        goalProgressEl.style.width = `${progress}%`;
    }
}

/**
 * Render weight history list
 */
function renderHistory() {
    const data = storage.getData();
    const entries = [...data.entries].reverse(); // Show newest first

    if (entries.length === 0) {
        historyList.innerHTML = '<div class="empty-state">記録がありません</div>';
        return;
    }

    historyList.innerHTML = entries.map(entry => `
        <div class="history-item">
            <div class="history-info">
                <div class="weight">${entry.weight} kg</div>
                <div class="date-time">${entry.date}</div>
            </div>
            <button class="btn-delete" data-id="${entry.id}">
                <i data-lucide="trash-2"></i>
            </button>
        </div>
    `).join('');

    // Re-initialize icons
    if (window.lucide) window.lucide.createIcons();

    // Add delete listeners
    historyList.querySelectorAll('.btn-delete').forEach(btn => {
        btn.onclick = () => {
            if (confirm('この記録を削除しますか？')) {
                storage.deleteEntry(Number(btn.dataset.id));
                updateUI();
            }
        };
    });
}

/**
 * Render food history list
 */
function renderFoodHistory() {
    const data = storage.getData();
    const entries = [...data.foodEntries].reverse(); // Show newest first

    if (entries.length === 0) {
        foodHistoryList.innerHTML = '<div class="empty-state">記録がありません</div>';
        return;
    }

    foodHistoryList.innerHTML = entries.map(entry => `
        <div class="history-item">
            <div class="history-info">
                <div class="food-desc">${entry.food}</div>
                <div class="date-time">${entry.date} ${entry.time}</div>
            </div>
            <button class="btn-delete-food" data-id="${entry.id}">
                <i data-lucide="trash-2"></i>
            </button>
        </div>
    `).join('');

    // Re-initialize icons
    if (window.lucide) window.lucide.createIcons();

    // Add delete listeners
    foodHistoryList.querySelectorAll('.btn-delete-food').forEach(btn => {
        btn.onclick = () => {
            if (confirm('この記録を削除しますか？')) {
                storage.deleteFoodEntry(Number(btn.dataset.id));
                updateUI();
            }
        };
    });
}

/**
 * Initialize or update the weight chart
 */
function initChart() {
    const data = storage.getData();
    const ctx = document.getElementById('weightChart').getContext('2d');

    const labels = data.entries.map(e => e.date);
    const weights = data.entries.map(e => e.weight);

    if (weightChart) {
        weightChart.destroy();
    }

    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '体重 (kg)',
                data: weights,
                borderColor: '#2d9cdb',
                backgroundColor: 'rgba(45, 156, 219, 0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#2d9cdb'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: '#f0f0f0' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

/**
 * Update all UI components
 */
function updateUI() {
    renderDashboard();
    renderHistory();
    renderFoodHistory();
    initChart();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // New weight entry form
    entryForm.onsubmit = (e) => {
        e.preventDefault();
        const weight = parseFloat(document.getElementById('weight').value);
        const date = document.getElementById('date').value;

        storage.addEntry({ weight, date });
        entryForm.reset();
        document.getElementById('date').valueAsDate = new Date();
        updateUI();
    };

    // New food entry form
    foodForm.onsubmit = (e) => {
        e.preventDefault();
        const food = document.getElementById('food-name').value;
        const time = document.getElementById('food-time').value;
        const date = document.getElementById('food-date').value;

        storage.addFoodEntry({ food, time, date });
        foodForm.reset();
        
        // Reset defaults
        const now = new Date();
        document.getElementById('food-date').valueAsDate = now;
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                            now.getMinutes().toString().padStart(2, '0');
        document.getElementById('food-time').value = currentTime;
        
        updateUI();
    };

    // Modal controls
    btnSettings.onclick = () => modalSettings.classList.add('active');
    closeModal.onclick = () => modalSettings.classList.remove('active');
    window.onclick = (e) => {
        if (e.target === modalSettings) modalSettings.classList.remove('active');
    };

    // Goal form
    goalForm.onsubmit = (e) => {
        e.preventDefault();
        const startWeight = parseFloat(document.getElementById('start-weight').value);
        const targetWeight = parseFloat(document.getElementById('target-weight').value);

        storage.setGoal({ startWeight, targetWeight });
        modalSettings.classList.remove('active');
        updateUI();
        alert('目標を保存しました！');
    };

    // Export
    btnExport.onclick = () => {
        const json = storage.exportData();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diet-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Import
    btnImportTrigger.onclick = () => importFile.click();
    importFile.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (storage.importData(event.target.result)) {
                updateUI();
                alert('データをインポートしました！');
                modalSettings.classList.remove('active');
            } else {
                alert('インポートに失敗しました。ファイル形式を確認してください。');
            }
        };
        reader.readAsText(file);
    };
}

// Start the app
init();
