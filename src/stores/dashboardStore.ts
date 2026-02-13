import { create } from 'zustand';
import { DashboardLayout, DashboardWidget } from '@/types/dashboard.types';

interface DashboardState {
  layout: DashboardLayout | null;
  isEditing: boolean;
  setLayout: (layout: DashboardLayout) => void;
  addWidget: (widget: DashboardWidget) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<DashboardWidget>) => void;
  toggleEditing: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  layout: null,
  isEditing: false,
  setLayout: (layout) => set({ layout }),
  addWidget: (widget) => set((s) => s.layout ? { layout: { ...s.layout, widgets: [...s.layout.widgets, widget] } } : s),
  removeWidget: (widgetId) => set((s) => s.layout ? { layout: { ...s.layout, widgets: s.layout.widgets.filter(w => w.id !== widgetId) } } : s),
  updateWidget: (widgetId, updates) => set((s) => s.layout ? { layout: { ...s.layout, widgets: s.layout.widgets.map(w => w.id === widgetId ? { ...w, ...updates } : w) } } : s),
  toggleEditing: () => set((s) => ({ isEditing: !s.isEditing })),
}));
export default useDashboardStore;