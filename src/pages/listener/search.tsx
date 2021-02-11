import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMe } from '../../hooks/useMe';
import { searchPodcasts } from '../../__generated__/searchPodcasts';
import {
  toggleSubscribe,
  toggleSubscribeVariables,
} from '../../__generated__/toggleSubscribe';
import { TOGGLE_SUBSCRIBE_MUTATION } from './podcasts';

export const SEARCH_QUERY = gql`
  query searchPodcasts($searchPodcastsInput: SearchPodcastsInput!) {
    searchPodcasts(input: $searchPodcastsInput) {
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

type TSearch = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  category: string;
  rating: number;
};

interface ISearchParams {
  term: string;
}

export const Search = () => {
  const params = useParams<ISearchParams>();
  const { data, loading } = useQuery<searchPodcasts>(SEARCH_QUERY, {
    variables: {
      searchPodcastsInput: {
        page: 1,
        titleQuery: params.term,
      },
    },
  });
  const { data: meData } = useMe();

  const onCompleted = (data: toggleSubscribe) => {
    const {
      toggleSubscribe: { ok },
    } = data;
    if (ok) {
      // alert('Subscribe!');
      window.location.reload();
    }
  };

  const [toggleSubscribeMutation] = useMutation<
    toggleSubscribe,
    toggleSubscribeVariables
  >(TOGGLE_SUBSCRIBE_MUTATION, {
    onCompleted,
    refetchQueries: [{ query: SEARCH_QUERY }],
  });

  const onSubscribe = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    podcastId: number
  ) => {
    e.preventDefault();
    toggleSubscribeMutation({
      variables: {
        toggleSubscribeInput: {
          podcastId,
        },
      },
    });
  };

  return (
    <div className="grid gap-5 grid-cols-4 mt-10 px-5 py-5">
      {loading && <div>Loading...</div>}
      {data?.searchPodcasts?.podcasts?.map((podcast: TSearch) => (
        <Link to={`/podcast/${podcast.id}`} key={podcast.id}>
          <div className="bg-lime-200 py-10 flex flex-col justify-center items-center rounded-lg">
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
            <div className="grid gap-1">
              <span>{podcast.title}</span>
              <span>{podcast.category}</span>
            </div>
            <div className="mt-5">
              <button
                className="mr-2 w-22 smBtn"
                onClick={e => onSubscribe(e, podcast.id)}
              >
                {meData?.me?.subsriptions?.find(
                  subscription => subscription.id === podcast.id
                )
                  ? 'Desubscribe'
                  : 'Subscribe'}
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
