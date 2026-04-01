const { getJestProjectsAsync } = require('@nx/jest');

module.exports = {
  projects: async () => {
    const projects = await getJestProjectsAsync();
    return projects;
  },
};
