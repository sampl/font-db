import { BaseHit } from "instantsearch.js/es/types";

export type Hit = BaseHit & {
  objectID: string;
  name: string;
  style: string;
};
