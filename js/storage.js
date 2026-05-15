/**
 * Storage module for handling LocalStorage operations.
 */
const STORAGE_KEY = 'diet_tracker_data';

export const storage = {
    /**
     * Get all data from localStorage
     * @returns {Object} { entries: [], goal: null }
     */
    getData() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : { entries: [], goal: null };
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
     * Delete an entry by ID
     * @param {number} id 
     */
    deleteEntry(id) {
        const data = this.getData();
        data.entries = data.entries.filter(e => e.id !== id);
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
                this.saveData(data);
                return true;
            }
        } catch (e) {
            console.error('Failed to import data:', e);
        }
        return false;
    }
};
