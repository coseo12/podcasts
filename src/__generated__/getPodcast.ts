/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPodcast
// ====================================================

export interface getPodcast_getPodcast_podcast_reviews {
  __typename: "Review";
  id: number;
  title: string;
  text: string;
  createdAt: any;
  updatedAt: any;
}

export interface getPodcast_getPodcast_podcast_episodes {
  __typename: "Episode";
  id: number;
  title: string;
  category: string;
  createdAt: any;
  updatedAt: any;
}

export interface getPodcast_getPodcast_podcast {
  __typename: "Podcast";
  id: number;
  createdAt: any;
  updatedAt: any;
  title: string;
  category: string;
  rating: number;
  reviews: getPodcast_getPodcast_podcast_reviews[];
  episodes: getPodcast_getPodcast_podcast_episodes[];
}

export interface getPodcast_getPodcast {
  __typename: "PodcastOutput";
  ok: boolean;
  error: string | null;
  podcast: getPodcast_getPodcast_podcast | null;
}

export interface getPodcast {
  getPodcast: getPodcast_getPodcast;
}

export interface getPodcastVariables {
  id: number;
}
