const getPage = (page = 1, size = 10) => {
  const limit = size;
  const offset = page * limit;
  return {
    limit,
    offset
  };
};

const pagination = async (modele, search, filter, page, size) => {
  const configPage = getPage(page, size);
  const models = await modele.find(search, filter, configPage);
  return models;
};

module.exports = pagination;