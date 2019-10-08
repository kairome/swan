import { ReduxState } from 'types/redux';
import { LoaderName } from 'types/entities';

export const rootSelector = (state: ReduxState) => state;

export const getPathname = (state: ReduxState) => state.router.location.pathname;

export const getLoader = (state: ReduxState, loaderName: LoaderName) => Boolean(state.navigation.loader[loaderName]);
