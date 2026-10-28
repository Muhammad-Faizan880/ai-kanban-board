import { createSlice } from "@reduxjs/toolkit";

const defaultPreferences = {
  emailNotifications: true,
  taskReminders: true,
  aiAutoSuggestions: true,
};

const getSavedPreferences = () => {
  try {
    const saved = localStorage.getItem("taskflow_preferences");
    return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
};

const initialState = getSavedPreferences();

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    togglePreference: (state, action) => {
      const key = action.payload;
      if (key in state) {
        state[key] = !state[key];
        localStorage.setItem("taskflow_preferences", JSON.stringify(state));
      }
    },
    setAllPreferences: (state, action) => {
      const updated = { ...state, ...action.payload };
      localStorage.setItem("taskflow_preferences", JSON.stringify(updated));
      return updated;
    },
  },
});

export const { togglePreference, setAllPreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;

