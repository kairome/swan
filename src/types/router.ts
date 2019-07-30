export interface RouterLocation {
  hash: string;
  pathname: string | null;
  search: string;
  state?: string;
}

interface Match<T> {
  isExact: boolean;
  path: string;
  url: string;
  params: T;
}

export interface Router<M> {
  location: RouterLocation;
  match: Match<M>;
}

interface IdMatch {
  id: string;
}

export type IdRouter = Router<IdMatch>;
