/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchPodcastsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: searchPodcasts
// ====================================================

export interface searchPodcasts_searchPodcasts_podcasts {
  __typename: "Podcast";
  id: number;
  createdAt: any;
  updatedAt: any;
  title: string;
  category: string;
  rating: number;
}

export interface searchPodcasts_searchPodcasts {
  __typename: "SearchPodcastsOutput";
  ok: boolean;
  error: string | null;
  podcasts: searchPodcasts_searchPodcasts_podcasts[] | null;
}

export interface searchPodcasts {
  searchPodcasts: searchPodcasts_searchPodcasts;
}

export interface searchPodcastsVariables {
  searchPodcastsInput: SearchPodcastsInput;
}
