import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import { ME_QUERY, useMe } from '../../hooks/useMe';
import {
  updatePodcastMutation,
  updatePodcastMutationVariables,
} from '../../__generated__/updatePodcastMutation';

export const UPDATE_PODCAST_MUTATION = gql`
  mutation updatePodcastMutation($updatePodcastInput: UpdatePodcastInput!) {
    updatePodcast(input: $updatePodcastInput) {
      ok
      error
    }
  }
`;

interface IEditPodcastForm {
  title: string;
  category: string;
  rating: number;
}
interface IPodcastParams {
  id: string;
}

export const EditPodcast = () => {
  const params = useParams<IPodcastParams>();
  const { data } = useMe();

  const podcast = data?.me.podcasts.find(podcast => podcast.id === +params.id);

  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<IEditPodcastForm>({
    mode: 'onChange',
    defaultValues: {
      title: podcast?.title,
      category: podcast?.category,
      rating: podcast?.rating,
    },
  });

  const history = useHistory();
  const onCompleted = (data: updatePodcastMutation) => {
    const {
      updatePodcast: { ok },
    } = data;
    if (ok) {
      alert('Edit Podcast!');
      history?.push('/');
    }
  };
  const [
    editProfileMutation,
    { loading, data: updatePodcastMutationResult },
  ] = useMutation<updatePodcastMutation, updatePodcastMutationVariables>(
    UPDATE_PODCAST_MUTATION,
    { onCompleted, refetchQueries: [{ query: ME_QUERY }] }
  );
  const onSubmit = () => {
    if (!loading) {
      const { title, category, rating } = getValues();
      editProfileMutation({
        variables: {
          updatePodcastInput: {
            id: +params.id,
            payload: {
              title,
              category,
              rating: +rating,
            },
          },
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-lg pt-5 pb-7 rounded-lg text-center border-2 border-lime-500">
        <h2 className="text-3xl mb-9">EDIT PODCAST</h2>
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
          <input
            ref={register({ required: 'Rating is required' })}
            name="rating"
            type="number"
            required
            placeholder="Rating"
            className="input"
          />
          {errors.rating?.message && (
            <FormError errorMessage={errors.rating?.message} />
          )}
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText="Edit Podcast"
          />
          {updatePodcastMutationResult?.updatePodcast.error && (
            <FormError
              errorMessage={updatePodcastMutationResult.updatePodcast.error}
            />
          )}
        </form>
      </div>
    </div>
  );
};
