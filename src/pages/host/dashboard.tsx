import React from 'react';
import { ME_QUERY, useMe } from '../../hooks/useMe';
import { Link, useHistory } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import {
  deletePodcastMutation,
  deletePodcastMutationVariables,
} from '../../__generated__/deletePodcastMutation';

export const DELETE_PODCAST_MUTATION = gql`
  mutation deletePodcastMutation($podcastSearchInput: PodcastSearchInput!) {
    deletePodcast(input: $podcastSearchInput) {
      ok
      error
    }
  }
`;

export const Dashboard = () => {
  const { data, loading, error } = useMe();
  const history = useHistory();

  const onCompleted = () => {
    alert('Delete Podcast!');
    history.push('/');
  };

  const [deletePodcastMutation] = useMutation<
    deletePodcastMutation,
    deletePodcastMutationVariables
  >(DELETE_PODCAST_MUTATION, {
    onCompleted,
    refetchQueries: [{ query: ME_QUERY }],
  });

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  const toEditPodcast = (
    id: number,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    history.push(`/edit-podcast/${id}`);
  };
  const deletePodcast = (
    id: number,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!loading) {
      deletePodcastMutation({
        variables: {
          podcastSearchInput: {
            id,
          },
        },
      });
    }
  };

  return (
    <div className="mt-20">
      <a href="/create-podcast" className="ml-10 smBtn">
        Create Podcast
      </a>
      <div className="bg-lime-200 pt-1 my-5"></div>
      <div className="w-full grid grid-cols-5 gap-2 m-2">
        {data?.me.podcasts.map(podcast => (
          <Link
            key={podcast.id}
            to={`/podcast-detail/${podcast.id}`}
            className="bg-lime-200 py-10 flex flex-col justify-center items-center rounded-lg"
          >
            <div className="mb-5">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-lime-700"
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
            <div>
              <span>🎙</span>
              <span>{podcast.title}</span>
            </div>
            <div>
              <span>{podcast.category}</span>
            </div>
            <div className="mt-5">
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                  toEditPodcast(podcast.id, e)
                }
                className="mr-2 w-16 smBtn"
              >
                Edit
              </button>
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                  deletePodcast(podcast.id, e)
                }
                className="smBtn w-16"
              >
                Delete
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
