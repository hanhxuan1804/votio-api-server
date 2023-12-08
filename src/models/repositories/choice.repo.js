const { models } = require("../../configs/database");
const { getInfoData, removeNullInArray } = require("../../utils");
const { choices } = models;

const updateListChoice = async ({ questionID, list }) => {
  //update choice exist
  const updates = await choices
    .findAll({
      where: {
        questionID: questionID,
      },
    })
    .then(async (choices) => {
      const listId = list.map((choice) => choice.choiceID);
      return await Promise.all(
        choices.map(async (choice) => {
          if (!listId.includes(choice.choiceID)) {
            choice.destroy();
            return null;
          } else {
            const updateData = list.find(
              (item) => item.choiceID === choice.choiceID
            );
            const choiceU = await choice.update({
              content: updateData.content,
            });
            return getInfoData({
              fields: ["choiceID", "content", "questionID"],
              object: choiceU,
            });
          }
        })
      );
    });
  //create choice new
  const listNew = list.filter((item) => item.choiceID === undefined);
  const news = await Promise.all(
    listNew.map(async (choice) => {
      const choiceN = await choices.create({
        questionID: questionID,
        content: choice.content,
      });
      if (!choiceN) {
        throw new InternalServerError({ message: "Create choice failed" });
      }
      return getInfoData({
        fields: ["choiceID", "content", "questionID"],

        object: choiceN,
      });
    })
  );
  return removeNullInArray([...updates, ...news]);
};
const deleteListChoice = async ({ questionID }) => {
  return await choices.destroy({
    where: {
      questionID: questionID,
    },
  });
};
const checkChoiceExist = async ({ choiceID }) => {
  const choice = await choices.findOne({
    where: {
      choiceID: choiceID,
    },
  });
  if (choice) {
    return true;
  } else {
    return false;
  }
};
const findChoiceById = async (choiceID) => {
  const choice = await choices.findOne({
    where: {
      choiceID: choiceID,
    },
  });
  if (choice) {
    return getInfoData({
      fields: ["choiceID", "content", "questionID"],
      object: choice,
    });
  } else {
    return null;
  }
};
module.exports = {
  updateListChoice,
  deleteListChoice,
  checkChoiceExist,
  findChoiceById,
};
