import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import {
  createReviewMutation,
  createReviewMutationVariables,
} from '../../__generated__/createReviewMutation';
import { PODCAST_QUERY } from '../listener/podcast';

export const CREATE_REVIEW_MUTATION = gql`
  mutation createReviewMutation($createReviewInput: CreateReviewInput!) {
    createReview(input: $createReviewInput) {
      ok
      error
    }
  }
`;

interface ICreatePodcastForm {
  title: string;
  text: string;
}

interface IEpisodeParams {
  podcastId: string;
}

export const CreateReview = () => {
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
  const onCompleted = (data: createReviewMutation) => {
    const {
      createReview: { ok },
    } = data;
    if (ok) {
      alert('Create Review!');
      history?.push(`/podcast/${params.podcastId}`);
    }
  };
  const [
    editProfileMutation,
    { loading, data: createReviewMutationResult },
  ] = useMutation<createReviewMutation, createReviewMutationVariables>(
    CREATE_REVIEW_MUTATION,
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
      const { title, text } = getValues();
      editProfileMutation({
        variables: {
          createReviewInput: {
            title,
            text,
            podcastId: +params.podcastId,
          },
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-lg pt-5 pb-7 rounded-lg text-center border-2 border-lime-500">
        <h2 className="text-3xl mb-9">CREATE REVIEW</h2>
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
            ref={register({ required: 'Text is required' })}
            name="text"
            type="text"
            required
            placeholder="Text"
            className="input"
          />
          {errors.text?.message && (
            <FormError errorMessage={errors.text?.message} />
          )}
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText="Create Category"
          />
          {createReviewMutationResult?.createReview.error && (
            <FormError
              errorMessage={createReviewMutationResult.createReview.error}
            />
          )}
        </form>
      </div>
    </div>
  );
};
