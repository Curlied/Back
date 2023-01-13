const userService = require('../services/user.service');
const eventService = require('../services/event.service');
const categoryService = require('../services/category.service');
const constants = require('../utils/Constantes');
const httpStatus = require('http-status');
const errorF = require('../utils/error');
const successF = require('../utils/success');
const { Role } = require('../models');
const { retrieve_user_from_token } = require('../middlewares/user.middleware');
const { getHeaderToken } = require('../utils/jwt');

const findById = async (request, response) => {
  const { params } = request;
  const { user_id } = params;
  const user = await userService.findOne(user_id);
  return successF(
    constants.MESSAGE.REGISTER_SUCCES,
    user,
    httpStatus.OK,
    response
  );
};

const myProfilDetailsUsers = async (request, response) => {
  const { token: { userId } } = await retrieve_user_from_token(getHeaderToken(request));
  const user = await userService.findOne(userId, 'username birth_date url_image');
  if (!user) {
    const error = new Error(constants.MESSAGE.USER_NOT_EXIST);
    return errorF(error, httpStatus.NOT_ACCEPTABLE, response);
  }
  /*==  PERSONAL PROFIL: ==*/
  const age = await userService.getAge(user.birth_date);

  /*==  EVENT USERS: ==*/
  // historique event create
  const allEventsCreate = await eventService.findAllByCreatorForMyProfil(userId);
  const allEventCreateInProgress = allEventsCreate.filter(x => x.date_time > Date.now());

  for (let i = 0; i < allEventCreateInProgress.length; i++) {
    const categorytName = await categoryService.FindOneById(allEventCreateInProgress[i].category);
    delete allEventCreateInProgress[i]._doc.category;
    allEventCreateInProgress[i]._doc.categoryInfo = {
      'name': categorytName?.name,
      'url_image': categorytName?.url_image,
      'url_icon': categorytName?.url_icon,
    };
  }

  let profilInfos = {
    'username': user.username,
    'age': age,
    'url_image': user.url_image,
    'description': 'Pionnièr(e) passionné(e) du Web. Praticien amateur de la culture pop. Amoureux d\'Internet. Accro au café. Spécialiste de la musique. Geek au bacon.',
    'eventInProgress': allEventCreateInProgress
  };

  return successF(
    'OK',
    profilInfos,
    httpStatus.OK,
    response
  );
};

const personalInformationsDetailsUser = async (request, response) => {
  const { token: { userId } } = await retrieve_user_from_token(getHeaderToken(request));
  const searchField = 'username description email birth_date telephone url_image';
  const user = await userService.findOne(userId, searchField);

  if (!user) {
    const error = new Error(constants.MESSAGE.USER_NOT_EXIST);
    return errorF(error, httpStatus.NOT_ACCEPTABLE, response);
  }

  /*==  PERSONAL PROFIL: ==*/
  let personalInformations = {
    'username': user.username,
    'email': user.email,
    'birthdate': user.birth_date,
    'description': user.description,
    'telephone': user.telephone,
    'url_image': user.url_image
  };
  return successF(
    'OK',
    personalInformations,
    httpStatus.OK,
    response
  );
};

const getAllEventsFromSpaceUser = async (request, response) => {
  /*==  EVENT USERS: ==*/
  // historique event create
  const { token: { userId } } = await retrieve_user_from_token(getHeaderToken(request));
  const allEventsCreate = await eventService.findAllForSpaceUserByCreator(userId);
  const allEventCreateInProgress = await allEventsCreate.filter(x => x.date_time > Date.now());

  // get category
  for (let i = 0; i < allEventCreateInProgress.length; i++) {
    const categorytName = await categoryService.FindOneById(allEventCreateInProgress[i].category);
    delete allEventCreateInProgress[i]._doc.category;
    allEventCreateInProgress[i]._doc.categoryInfo = {
      'name': categorytName?.name,
      'url_image': categorytName?.url_image,
      'url_icon': categorytName?.url_icon,
    };
  }


  /* RECUP ALL USER ON EVENT CREATED , IN PROGRESS AND VALIDATE*/
  for (let i = 0; i < allEventCreateInProgress.length; i++) {
    if (allEventCreateInProgress[i].is_validate) {

      const users_valideArray = allEventCreateInProgress[i].users_valide.map(w => w.user_id);
      const users_waitingArray = allEventCreateInProgress[i].users_waiting.map(w => w.user_id);
      const users_refusedArray = allEventCreateInProgress[i].users_refused.map(w => w.user_id);
      const users_cancelArray = allEventCreateInProgress[i].users_cancel.map(w => w.user_id);
      const arrayUserValide = await userService.findManyUsersByUserArrayNoAsync(users_valideArray, 'username');
      const arrayUserWaiting = await userService.findManyUsersByUserArrayNoAsync(users_waitingArray, 'username');
      const arrayUserRefused = await userService.findManyUsersByUserArrayNoAsync(users_refusedArray, 'username');
      const arrayUserCancel = await userService.findManyUsersByUserArrayNoAsync(users_cancelArray, 'username');

      allEventCreateInProgress[i]._doc.users_valide = arrayUserValide;
      allEventCreateInProgress[i]._doc.users_waiting = arrayUserWaiting;
      allEventCreateInProgress[i]._doc.users_refused = arrayUserRefused;
      allEventCreateInProgress[i]._doc.users_cancel = arrayUserCancel;
    } else {
      delete allEventCreateInProgress[i]._doc.users_valide;
      delete allEventCreateInProgress[i]._doc.users_waiting;
      delete allEventCreateInProgress[i]._doc.users_refused;
      delete allEventCreateInProgress[i]._doc.users_cancel;
    }
  }

  //Evénements Participé
  const allEventRequestParticipate = await eventService.findAllEventsUserParticpateIn(userId);
  const allEventParticipateInProgress = allEventRequestParticipate.filter(x => x.date_time > Date.now());

  for (let i = 0; i < allEventParticipateInProgress.length; i++) {
    const categorytName = await categoryService.FindOneById(allEventParticipateInProgress[i].category);
    delete allEventParticipateInProgress[i]._doc.category;
    allEventParticipateInProgress[i]._doc.categoryInfo = {
      'name': categorytName.name,
      'url_image': categorytName.url_image,
      'url_icon': categorytName.url_icon,
    };

    const currentUserValidate = allEventParticipateInProgress[i].users_valide.find(usr => usr.user_id == userId);
    const currentUserWaiting = allEventParticipateInProgress[i].users_waiting.find(usr => usr.user_id == userId);
    allEventParticipateInProgress[i]._doc.statusCurrentUser = currentUserValidate ? "validé" : currentUserWaiting ? "en attente" : "inconnu";
    delete allEventParticipateInProgress[i]._doc.users_valide;
    delete allEventParticipateInProgress[i]._doc.users_waiting;
  }

  const allEvents = {
    eventsCreate: allEventCreateInProgress,
    eventsParticipate: allEventParticipateInProgress,
  };

  return successF(
    constants.MESSAGE.GET_USER_EVENTS_OK,
    allEvents,
    httpStatus.OK,
    response
  );
};

const getRoles = async (request, response) => {
  const { token: { roles } } = await retrieve_user_from_token(getHeaderToken(request));
  let user_roles = await Promise.all(roles.map(async (roleId) => {
    const role = await Role.findOne({
      _id: roleId
    });
    return role?.name;
  }));
  return successF(
    'Here my roles',
    user_roles,
    httpStatus.OK,
    response
  );
};

const updateInfo = async (request, response) => {
  const { body } = request;
  const { token: { userId } } = await retrieve_user_from_token(getHeaderToken(request));
  await userService.findOneAndUpdateInformations(userId, body);
  return successF(
    'L\'utilisateur a été actualisé avec succès',
    true,
    httpStatus.OK,
    response
  );
};

module.exports = {
  findById,
  myProfilDetailsUsers,
  personalInformationsDetailsUser,
  getAllEventsFromSpaceUser,
  getRoles,
  updateInfo
};