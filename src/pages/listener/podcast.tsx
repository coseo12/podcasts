import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

export const PODCAST_QUERY = gql`
  query getPodcast($id: Int!) {
    getPodcast(input: { id: $id }) {
      ok
      error
      podcast {
        id
        createdAt
        updatedAt
        title
        category
        rating
        reviews {
          id
          title
          text
          createdAt
          updatedAt
        }
        episodes {
          id
          title
          category
          createdAt
          updatedAt
        }
      }
    }
  }
`;

interface IPodcastParams {
  id: string;
}

export const Podcast = () => {
  const params = useParams<IPodcastParams>();
  const { data, loading } = useQuery(PODCAST_QUERY, {
    variables: {
      id: +params.id,
    },
  });

  return (
    <div className="flex items-center justify-center mt-20">
      {loading && <div>Loading...</div>}
      {data?.getPodcast && (
        <div className="grid gap-5 bg-red-100 rounded-md px-10 py-10 shadow md:shadow-lg">
          <div className="flex items-center flex-start">
            <img
              className="w-12 h-12 mr-5"
              src={`/podcast.svg`}
              alt="Podcast Logo"
            />
            <span>{data.getPodcast.podcast.title}</span>
          </div>
          <span>{data.getPodcast.podcast.category}</span>
          <span role="img" aria-labelledby="">
            ⭐ {data.getPodcast.podcast.rating} / 10
          </span>
          <span>
            {new Date(data.getPodcast.podcast.createdAt).toLocaleString(
              'ko-KR'
            )}
          </span>
        </div>
      )}
    </div>
  );
};
