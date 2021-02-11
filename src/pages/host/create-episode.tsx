import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import { ME_QUERY } from '../../hooks/useMe';
import {
  createEpisodeMutation,
  createEpisodeMutationVariables,
} from '../../__generated__/createEpisodeMutation';
import { PODCAST_QUERY } from '../listener/podcast';

export const CREATE_EPISODE_MUTATION = gql`
  mutation createEpisodeMutation($createEpisodeInput: CreateEpisodeInput!) {
    createEpisode(input: $createEpisodeInput) {
      ok
      error
    }
  }
`;

interface ICreatePodcastForm {
  title: string;
  category: string;
}

interface IEpisodeParams {
  podcastId: string;
}

export const CreateEpisode = () => {
  const params = useParams<IEpisodeParams>();
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<ICreatePodcastForm>({
    mode: 'onChange',
  });
  const history = useHistory();
  const onCompleted = (data: createEpisodeMutation) => {
    const {
      createEpisode: { ok },
    } = data;
    if (ok) {
      alert('Create Episode!');
      history?.push(`/podcast-detail/${params.podcastId}`);
    }
  };
  const [
    editProfileMutation,
    { loading, data: createEpisodeMutationResult },
  ] = useMutation<createEpisodeMutation, createEpisodeMutationVariables>(
    CREATE_EPISODE_MUTATION,
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
      editProfileMutation({
        variables: {
          createEpisodeInput: {
            title,
            category,
            podcastId: +params.podcastId,
          },
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-lg pt-5 pb-7 rounded-lg text-center border-2 border-lime-500">
        <h2 className="text-3xl mb-9">CREATE PROFILE</h2>
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
            actionText="Create Category"
          />
          {createEpisodeMutationResult?.createEpisode.error && (
            <FormError
              errorMessage={createEpisodeMutationResult.createEpisode.error}
            />
          )}
        </form>
      </div>
    </div>
  );
};
