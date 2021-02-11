import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Button } from '../components/button';
import { FormError } from '../components/form-error';
import {
  editProfileMutation,
  editProfileMutationVariables,
} from '../__generated__/editProfileMutation';

export const EDIT_PROFILE_MUTATION = gql`
  mutation editProfileMutation($editProfileInput: EditProfileInput!) {
    editProfile(input: $editProfileInput) {
      ok
      error
    }
  }
`;

interface IEditProfileForm {
  email: string;
  password: string;
}

export const EditProfile = () => {
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<IEditProfileForm>({
    mode: 'onChange',
  });
  const history = useHistory();
  const onCompleted = (data: editProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok) {
      alert('Edit Profile!');
      history?.push('/');
    }
  };
  const [
    editProfileMutation,
    { loading, data: editProfileMutationResult },
  ] = useMutation<editProfileMutation, editProfileMutationVariables>(
    EDIT_PROFILE_MUTATION,
    { onCompleted }
  );
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      editProfileMutation({
        variables: {
          editProfileInput: {
            email,
            password,
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
              required: 'Email is required',
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            type="email"
            required
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type === 'pattern' && (
            <FormError errorMessage={`Please enter a valid email`} />
          )}
          <input
            ref={register({ required: 'Password is required' })}
            name="password"
            type="password"
            required
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText="Edit Profile"
          />
          {editProfileMutationResult?.editProfile.error && (
            <FormError
              errorMessage={editProfileMutationResult.editProfile.error}
            />
          )}
        </form>
      </div>
    </div>
  );
};
