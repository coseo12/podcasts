import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { Link } from 'react-router-dom';
import { getAllPodcasts } from '../../__generated__/getAllPodcasts';

const PODCASTS_QUERY = gql`
  query getAllPodcasts {
    getAllPodcasts {
      ok
      error
      podcasts {
        id
        createdAt
        updatedAt
        title
        category
        rating
      }
    }
  }
`;

type TPodcast = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  category: string;
  rating: number;
};
// type Podcasts = Podcast[];

export const Podcasts = () => {
  const { data, loading } = useQuery<getAllPodcasts>(PODCASTS_QUERY);

  return (
    <div className="grid gap-5 grid-cols-4 mt-10 px-5 py-5">
      {loading && <div>Loading...</div>}
      {data?.getAllPodcasts?.podcasts?.map((podcast: TPodcast) => (
        <Link to={`/podcast/${podcast.id}`} key={podcast.id}>
          <div className="flex items-center flex-start px-5 py-5 rounded-md bg-red-100 shadow md:shadow-lg">
            <img
              className="w-12 h-12 mr-5"
              src={`/podcast.svg`}
              alt="Podcast Logo"
            />
            <div className="grid gap-1">
              <span>{podcast.title}</span>
              <span>{podcast.category}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
