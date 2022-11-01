const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');
const eventService = require('../services/event.service');
const categoryService = require('../services/category.service');
const constants = require('../utils/Constantes');
const httpStatus = require('http-status');
const errorF = require('../utils/error');
const successF = require('../utils/success');
const {
  Role
} = require('../models');
const findById = catchAsync(async (req, res, next) => {
  try {
    const user = await userService.findOne(req.params);

    successF(constants.MESSAGE.REGISTER_SUCCES, user, 200, res, next);
  } catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
});

const myProfilDetailsUsers = catchAsync(async (req, res, next) => {
  try {
    const user = await userService.findOne(req.user.userId, 'username birth_date url_image');
    if (!user) {
      const error = new Error(constants.MESSAGE.USER_NOT_EXIST);
      errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
    }
    /*==  PERSONAL PROFIL: ==*/
    const age = await userService.getAge(user.birth_date);


    /*==  EVENT USERS: ==*/
    // historique event create
    const allEventsCreate = await eventService.findAllByCreatorForMyProfil(user._id);
    const allEventCreateInProgress = await allEventsCreate.filter(x => x.date_time > Date.now());

    for (let i = 0; i < allEventCreateInProgress.length; i++) {
      const categorytName = await categoryService.FindOneById(allEventCreateInProgress[i].category);
      delete allEventCreateInProgress[i]._doc.category;
      allEventCreateInProgress[i]._doc.categoryInfo = {
        'name': categorytName.name,
        'url_image': categorytName.url_image,
        'url_icon': categorytName.url_icon,
      };
    }

    let profilInfos = {
      'username': user.username,
      'age': age,
      'url_image': user.url_image,
      'description': 'Pionnièr(e) passionné(e) du Web. Praticien amateur de la culture pop. Amoureux d\'Internet. Accro au café. Spécialiste de la musique. Geek au bacon.',
      'eventInProgress': allEventCreateInProgress
    };

    successF('OK', profilInfos, 200, res, next);
  } catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
});

const personalInformationsDetailsUser = catchAsync(async (req, res, next) => {
  try {
    const user = await userService.findOne(req.user.userId, 'username description email birth_date telephone url_image');

    if (!user) {
      const error = new Error(constants.MESSAGE.USER_NOT_EXIST);
      errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
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
    successF('ok', personalInformations, 200, res, next);
  } catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
});

const getAllEventsFromSpaceUser = catchAsync(async (req, res, next) => {
  try {


    /*==  EVENT USERS: ==*/
    // historique event create
    const allEventsCreate = await eventService.findAllForSpaceUserByCreator(req.user.userId);
    const allEventCreateInProgress = await allEventsCreate.filter(x => x.date_time > Date.now());

    // get category
    for (let i = 0; i < allEventCreateInProgress.length; i++) {
      const categorytName = await categoryService.FindOneById(allEventCreateInProgress[i].category);
      delete allEventCreateInProgress[i]._doc.category;
      allEventCreateInProgress[i]._doc.categoryInfo = {
        'name': categorytName.name,
        'url_image': categorytName.url_image,
        'url_icon': categorytName.url_icon,
      };
    }


    /* RECUP ALL USER ON EVENT CREATED , IN PROGRESS AND VALIDATE*/
    for (let i = 0; i < allEventCreateInProgress.length; i++) {
      if (allEventCreateInProgress[i].is_validate == true) {

        const usersIdArray = allEventCreateInProgress[i].users.map(w => w.user_id);
        const arrayUser = await userService.findManyUsersByUserArrayNoAsync(usersIdArray, 'username');


        // find a similar id between UserIdOnEvent
        // and user
        for (let y = 0; y < arrayUser.length; y++) {
          let usersOnEvent = await allEventCreateInProgress[i].users;
          const userWithStatut = usersOnEvent.find(x => x.user_id.toString() == arrayUser[y].id);
          arrayUser[y]._doc.status = userWithStatut.status;
          delete arrayUser[y]._doc._id;
        }

        allEventCreateInProgress[i]._doc.usersComplet = arrayUser;
        delete allEventCreateInProgress[i]._doc.users;
      } else {
        delete allEventCreateInProgress[i]._doc.users;
      }
    }

    //Evénements Participé
    const allEventRequestParticipate = await eventService.findAllEventsUserParticpateIn(req);
    const allEventParticipateInProgress = allEventRequestParticipate.filter(x => x.date_time > Date.now());

    for (let i = 0; i < allEventParticipateInProgress.length; i++) {
      const categorytName = await categoryService.FindOneById(allEventParticipateInProgress[i].category);
      delete allEventParticipateInProgress[i]._doc.category;
      allEventParticipateInProgress[i]._doc.categoryInfo = {
        'name': categorytName.name,
        'url_image': categorytName.url_image,
        'url_icon': categorytName.url_icon,
      };

      const currentUser = allEventParticipateInProgress[i].users.find(usr => usr.user_id == req.user.userId);
      allEventParticipateInProgress[i]._doc.statusCurrentUser = currentUser._doc.status;
      delete allEventParticipateInProgress[i]._doc.users;
    }


    const allEvents = {
      eventsCreate: allEventCreateInProgress,
      eventsParticipate: allEventParticipateInProgress,
    };

    successF(constants.MESSAGE.REGISTER_SUCCES, allEvents, 200, res, next);
  } catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
});

const getRoles = catchAsync(async (req, res, next) => {
  let roles = req.user.roles;
  roles = await Promise.all(roles.map(async (roleId) => {
    const role = await Role.findOne({
      _id: roleId
    });
    return role.name;
  }));
  successF('Voici mes roles', roles, 200, res, next);
});

module.exports = {
  findById,
  myProfilDetailsUsers,
  personalInformationsDetailsUser,
  getAllEventsFromSpaceUser,
  getRoles
};