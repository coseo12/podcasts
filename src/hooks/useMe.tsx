import { gql, useQuery } from '@apollo/client';
import { meQuery } from '../__generated__/meQuery';

export const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      podcasts {
        id
        title
        category
        rating
        createdAt
        updatedAt
      }
      subsriptions {
        id
        title
        category
        rating
        createdAt
        updatedAt
      }
    }
  }
`;

export const useMe = () => {
  return useQuery<meQuery>(ME_QUERY);
};
