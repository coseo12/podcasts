import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import { ME_QUERY } from '../../hooks/useMe';
import { getPodcast } from '../../__generated__/getPodcast';
import {
  updateEpisodeMutation,
  updateEpisodeMutationVariables,
} from '../../__generated__/updateEpisodeMutation';
import { PODCAST_QUERY } from '../listener/podcast';

export const UPDATE_EPISODE_MUTATION = gql`
  mutation updateEpisodeMutation($updateEpisodeInput: UpdateEpisodeInput!) {
    updateEpisode(input: $updateEpisodeInput) {
      ok
      error
    }
  }
`;

interface IEditEpisodeForm {
  title: string;
  category: string;
}
interface IEpisodeParams {
  podcastId: string;
  episodeId: string;
}

export const EditEpisode = () => {
  const params = useParams<IEpisodeParams>();

  const { data } = useQuery<getPodcast>(PODCAST_QUERY, {
    variables: {
      id: +params.podcastId,
    },
  });

  const episode = data?.getPodcast.podcast?.episodes.find(
    episode => episode.id === +params.episodeId
  );

  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<IEditEpisodeForm>({
    mode: 'onChange',
    defaultValues: {
      title: episode?.title,
      category: episode?.category,
    },
  });

  const history = useHistory();
  const onCompleted = (data: updateEpisodeMutation) => {
    const {
      updateEpisode: { ok },
    } = data;
    if (ok) {
      alert('Edit Episode!');
      history?.push(`/podcast-detail/${params.podcastId}`);
    }
  };
  const [
    updateEpisodeMutation,
    { loading, data: updateEpisodeMutationResult },
  ] = useMutation<updateEpisodeMutation, updateEpisodeMutationVariables>(
    UPDATE_EPISODE_MUTATION,
    {
      onCompleted,
      refetchQueries: [
        {
          query: PODCAST_QUERY,
          variables: {
            id: +params.podcastId,
          },
        },
      ],
    }
  );
  const onSubmit = () => {
    if (!loading) {
      const { title, category } = getValues();
      updateEpisodeMutation({
        variables: {
          updateEpisodeInput: {
            podcastId: +params.podcastId,
            episodeId: +params.episodeId,
            title,
            category,
          },
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-lg pt-5 pb-7 rounded-lg text-center border-2 border-lime-500">
        <h2 className="text-3xl mb-9">EDIT EPISODE</h2>
        <form
          className="grid gap-3 mt-5 px-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            ref={register({
              required: 'Title is required',
            })}
            name="title"
            type="text"
            required
            placeholder="Title"
            className="input"
          />
          {errors.title?.message && (
            <FormError errorMessage={errors.title?.message} />
          )}
          <input
            ref={register({ required: 'Category is required' })}
            name="category"
            type="text"
            required
            placeholder="Category"
            className="input"
          />
          {errors.category?.message && (
            <FormError errorMessage={errors.category?.message} />
          )}
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText="Edit Episode"
          />
          {updateEpisodeMutationResult?.updateEpisode.error && (
            <FormError
              errorMessage={updateEpisodeMutationResult.updateEpisode.error}
            />
          )}
        </form>
      </div>
    </div>
  );
};
