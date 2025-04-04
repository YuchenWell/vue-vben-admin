export default {
  'commit-msg': 'pnpm exec commitlint --edit',
  'post-merge': 'pnpm install',
  'pre-commit': 'pnpm exec lint-staged',
};
