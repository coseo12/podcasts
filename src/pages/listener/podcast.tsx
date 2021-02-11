import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { getPodcast } from '../../__generated__/getPodcast';

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
  const { data, loading } = useQuery<getPodcast>(PODCAST_QUERY, {
    variables: {
      id: +params.id,
    },
  });

  return (
    <div className="flex items-center justify-center">
      {loading && <div>Loading...</div>}
      {data?.getPodcast && (
        <div className="w-full h-full grid gap-5 bg-lime-100 rounded-md px-10 py-10 shadow md:shadow-lg">
          <div className="mb-5">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg">
              <svg
                className="w-12 h-12 text-lime-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                ></path>
              </svg>
            </div>
          </div>
          <div className="flex items-center flex-start">
            <span>{data?.getPodcast?.podcast?.title}</span>
          </div>
          <span>{data?.getPodcast.podcast?.category}</span>
          <span role="img" aria-labelledby="">
            ⭐ {data?.getPodcast?.podcast?.rating}
          </span>
          <span>
            {new Date(data?.getPodcast?.podcast?.createdAt).toLocaleString(
              'ko-KR'
            )}
          </span>
          <div className="pt-1 bg-lime-400"></div>
          <div className="flex justify-start items-center">
            <span>Episodes 📡</span>
            <span></span>
          </div>
          {data?.getPodcast?.podcast?.episodes.map(episode => (
            <div
              key={episode.id}
              className="flex justify-between items-center bg-lime-300 rounded-lg px-10 py-2"
            >
              <div className="flex flex-col justify-center items-start">
                <span className="font-bold">{episode.title}</span>
                <span className="text-sm">{episode.category}</span>
              </div>
              <div className="text-sm">
                {new Date(episode.createdAt).toLocaleString('ko-KR')}
              </div>
            </div>
          ))}
          <div className="pt-1 bg-lime-400"></div>
          <span>Reviews 📬</span>
          {data?.getPodcast?.podcast?.reviews.map((review: any) => (
            <div
              key={review.id}
              className="flex justify-between items-center bg-lime-300 rounded-lg px-10 py-2"
            >
              <div className="flex flex-col justify-center items-start">
                <span className="font-bold">{review.title}</span>
                <span className="text-sm">{review.text}</span>
              </div>
              <div>
                <span className="text-sm">
                  {new Date(review.createdAt).toLocaleString('ko-KR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
