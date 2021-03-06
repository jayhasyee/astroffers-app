import { State, ListItemProp } from './types';
import defaultState from './defaultState';
import { objectTypes, constellations, BirghtnessType } from 'astroffers-core';
import sorters from './utils/sorters';

export const sort = (listItemProp: ListItemProp) => (state: State): State => ({
  ...state,
  settings: { ...state.settings, sortBy: listItemProp },
  result: state.result ? { ...state.result, list: state.result.list.sort(sorters[listItemProp]) } : null
});

export const resetFilter = () => (state: State): State => ({ ...state, filter: defaultState.filter });

export const changeFilter = (prop: string, value: number | boolean | BirghtnessType) => (state: State): State => ({
  ...state,
  filter: { ...state.filter, [prop]: value }
});

export const toggleSetFilter = (set: string, typeKey: string) => (state: State): State => ({
  ...state,
  filter: {
    ...state.filter,
    [set]: {
      ...state.filter[set],
      [typeKey]: !state.filter[set][typeKey]
    }
  }
});

export const changeAllTypeFilter = (value: boolean) => (state: State): State => ({
  ...state,
  filter: {
    ...state.filter,
    types: Object.keys(objectTypes).reduce((acc, type) => ({ ...acc, [type]: value }), {})
  }
});

export const changeAllConstellationFilter = (value: boolean) => (state: State): State => ({
  ...state,
  filter: {
    ...state.filter,
    constellations: Object.keys(constellations).reduce((acc, cons) => ({ ...acc, [cons]: value }), {})
  }
});

export const filterObjects = () => (state: State) => async (dispatch, getState, { api }) => {
  dispatch((state: State): State => ({ ...state, isFiltering: true }));
  const result = await api.filterObjects(getState().filter);
  const sortBy = getState().settings.sortBy;
  dispatch((state: State): State => ({
    ...state,
    result: { ...result, list: result.list.sort(sorters[sortBy]) },
    isFiltering: false
  }));
};

export const fetchLocation = () => (state: State) => async (dispatch, getState, { location }) =>
  location.fetchLocation();

export const openDetails = (openedDetails: number) => (state: State): State => ({ ...state, openedDetails });

export const closeDetails = () => (state: State): State => ({ ...state, openedDetails: null });

export const openAbout = () => (state: State): State => ({ ...state, isOpenAbout: true });

export const closeAbout = () => (state: State): State => ({ ...state, isOpenAbout: false });
