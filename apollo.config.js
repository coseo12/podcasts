module.exports = {
  client: {
    includes: ['./src/**/*.{tsx,ts}'],
    tagName: 'gql',
    service: {
      name: 'podcasts',
      url: 'https://s-nuber-challenges.herokuapp.com/graphql',
    },
  },
};
