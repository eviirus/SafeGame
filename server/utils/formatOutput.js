async function formatOutput(questions, answers) {
  try {
    const updatedQuestions = questions.map((questionsCategory) => {
      const updatedItems = questionsCategory.items.map((item) => {
        const matchingAnswer = answers.find(
          (a) => a.question === item.metaname
        );

        return {
          ...item,
          answer: matchingAnswer ? matchingAnswer.answer === "true" : false,
        };
      });

      return {
        ...questionsCategory,
        items: updatedItems,
      };
    });

    return updatedQuestions;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { formatOutput };
