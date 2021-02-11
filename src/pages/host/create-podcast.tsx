import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import { ME_QUERY } from '../../hooks/useMe';
import {
  createPodcastMutation,
  createPodcastMutationVariables,
} from '../../__generated__/createPodcastMutation';

export const CREATE_PODCAST_MUTATION = gql`
  mutation createPodcastMutation($createPodcastInput: CreatePodcastInput!) {
    createPodcast(input: $createPodcastInput) {
      ok
      error
    }
  }
`;

interface ICreatePodcastForm {
  title: string;
  category: string;
}

export const CreatePodcast = () => {
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
  const onCompleted = (data: createPodcastMutation) => {
    const {
      createPodcast: { ok },
    } = data;
    if (ok) {
      alert('Create Podcast!');
      history?.push('/');
    }
  };
  const [
    editProfileMutation,
    { loading, data: createPodcastMutationResult },
  ] = useMutation<createPodcastMutation, createPodcastMutationVariables>(
    CREATE_PODCAST_MUTATION,
    { onCompleted, refetchQueries: [{ query: ME_QUERY }] }
  );
  const onSubmit = () => {
    if (!loading) {
      const { title, category } = getValues();
      editProfileMutation({
        variables: {
          createPodcastInput: {
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
        <h2 className="text-3xl mb-9">EDIT PROFILE</h2>
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
          {createPodcastMutationResult?.createPodcast.error && (
            <FormError
              errorMessage={createPodcastMutationResult.createPodcast.error}
            />
          )}
        </form>
      </div>
    </div>
  );
};
