const getPage = (req) => {
  const {
    page,
    size
  } = req.query;
  const limit = size ? size : 10;
  const offset = page ? page * limit : 0;

  return {
    limit,
    offset
  };
};

const pagination = async (modele, req) => {
  const configPage = getPage(req);
  const role = await modele.paginate(req.filter, configPage);
  return role;
};

module.exports = pagination;