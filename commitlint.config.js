module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    //   TODO Add Scope Enum Here
    // 'scope-enum': [2, 'always', ['yourscope', 'yourscope']],
    "type-enum": [
      2,
      "always",
      [
        "feat", // adding a new feature to the codebase.
        "fix", // fixing a bug or issue in the codebase.
        "docs", // README files or comments in the code.
        "chore", // adding or updating dependencies and packages
        "style", // change styling like css or className incase of taliwindcss
        "refactor", // improve the structure or organization of the code.
        "test", // adding or updating tests for the codebase.
        "revert", // reverting a previous commit.
        "perf", // improve the performance of the code.
      ],
    ],
  },
}
