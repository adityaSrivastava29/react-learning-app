import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface UserSettings {
  id: string;
  username: string;
  email: string;
  notifications: boolean;
  language: string;
}

interface SettingsState {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: null,
  loading: false,
  error: null,
};

// Async thunk for fetching settings
export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (userId: string) => {
    console.log(`⚙️ [Redux] Fetching settings for user: ${userId}`);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      id: userId,
      username: `${userId}`,
      email: `${userId}@example.com`,
      notifications: true,
      language: "en",
    };
  }
);

// Async thunk for updating settings
export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (settings: Partial<UserSettings>) => {
    console.log(`⚙️ [Redux] Updating settings:`, settings);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    return settings;
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearSettings: (state) => {
      state.settings = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch settings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch settings";
      })
      // Update settings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        if (state.settings) {
          state.settings = { ...state.settings, ...action.payload };
        }
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update settings";
      });
  },
});

export const { clearSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
