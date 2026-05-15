/**
 * Storage module for handling LocalStorage operations.
 */
const STORAGE_KEY = 'diet_tracker_data';

export const storage = {
    /**
     * Get all data from localStorage
     * @returns {Object} { entries: [], foodEntries: [], goal: null }
     */
    getData() {
        const data = localStorage.getItem(STORAGE_KEY);
        const parsed = data ? JSON.parse(data) : { entries: [], foodEntries: [], goal: null };
        if (!parsed.foodEntries) parsed.foodEntries = [];
        return parsed;
    },

    /**
     * Save data to localStorage
     * @param {Object} data 
     */
    saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    /**
     * Add a new weight entry
     * @param {Object} entry { weight: number, date: string }
     */
    addEntry(entry) {
        const data = this.getData();
        data.entries.push({
            id: Date.now(),
            ...entry
        });
        // Sort entries by date
        data.entries.sort((a, b) => new Date(a.date) - new Date(b.date));
        this.saveData(data);
    },

    /**
     * Add a new food entry
     * @param {Object} entry { food: string, time: string, date: string }
     */
    addFoodEntry(entry) {
        const data = this.getData();
        data.foodEntries.push({
            id: Date.now(),
            ...entry
        });
        // Sort by date and time
        data.foodEntries.sort((a, b) => {
            const dateComp = new Date(a.date) - new Date(b.date);
            if (dateComp !== 0) return dateComp;
            return a.time.localeCompare(b.time);
        });
        this.saveData(data);
    },

    /**
     * Delete a weight entry by ID
     * @param {number} id 
     */
    deleteEntry(id) {
        const data = this.getData();
        data.entries = data.entries.filter(e => e.id !== id);
        this.saveData(data);
    },

    /**
     * Delete a food entry by ID
     * @param {number} id 
     */
    deleteFoodEntry(id) {
        const data = this.getData();
        data.foodEntries = data.foodEntries.filter(e => e.id !== id);
        this.saveData(data);
    },

    /**
     * Set the target goal
     * @param {Object} goal { targetWeight: number, startWeight: number }
     */
    setGoal(goal) {
        const data = this.getData();
        data.goal = goal;
        this.saveData(data);
    },

    /**
     * Export data as JSON string
     * @returns {string}
     */
    exportData() {
        return JSON.stringify(this.getData(), null, 2);
    },

    /**
     * Import data from JSON string
     * @param {string} jsonString 
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data && Array.isArray(data.entries)) {
                if (!data.foodEntries) data.foodEntries = [];
                this.saveData(data);
                return true;
            }
        } catch (e) {
            console.error('Failed to import data:', e);
        }
        return false;
    }
};
