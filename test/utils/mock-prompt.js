// Mock of @creuna/prompt
// Expects a questions object like in original prompt, and an answers object with keys corresponding to the questions object.

module.exports = (answers, questions) =>
  Object.entries(questions).reduce(
    (accum, [key, question]) =>
      Object.assign(accum, { [key]: question.value || answers[key] }),
    {}
  );
