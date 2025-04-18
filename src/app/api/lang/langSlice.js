import { createSlice } from "@reduxjs/toolkit";

const langSlice = createSlice({
  name: 'lang',
  initialState: {
    value: 'vi',
    label: 'Vietnamese',
    icon: '/assets/icons/ic_flag_vi.svg',
  },
  reducers: {
    changeLang: (state, action) => {
      const { value, label, icon } = action.payload;
      state.value = value;
      state.label = label;
      state.icon = icon;
    },
  },
});

export const {
  changeLang
} = langSlice.actions;

export default langSlice.reducer;

export const selectCurrentLang = (state) => state.lang;
