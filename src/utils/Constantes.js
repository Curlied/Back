const moment = require('moment');

const uuid = () => {
  return 'xxxxxxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const convertDateStringToDate = (date_string) => {
  return moment(date_string, 'DD/MM/YYYY HH:mm').add(1, 'hours');
}

module.exports = Object.freeze({
  MESSAGE: {
    PARAMS_IS_REQUIRED: 'Parameters in path are required',
    QUERY_IS_REQUIRED: 'Queries in path are required',
    BODY_IS_REQUIRED: 'The body in request is required',
    REGISTER_SUCCES: 'Votre compte à correctement été enregistré, veuillez confirmer votre email',
    REGISTER_FAILED: 'Une erreur est survenue pendant la procédure d\'inscription',
    EMAIL_ALSO_EXIST: 'L\'adresse email est déjà présente',
    IMAGE_USER_NOT_UPLOAD: 'L\'image de l\'utilisateur n\'as pas pû être uploadé',
    CONFIRMATION_MAIL_SUCCESS: 'Votre compte a été créée et validé avec succès',
    CONFIRMATION_MAIL_NOT_POSSIBLE: 'Il n\'y a pas d\'adresse mail à confirmer',
    CONFIRMATION_MAIL_ERROR: 'L\'actualisation de l\'adresse n\'a pas pû être réalisé',
    CONFIRMATION_EVENT_ADD: 'L\'évènement à bien été enregistrer et est en attente de validation',
    CONFIRMATION_NOT_MADE: 'Vous n\'avez pas encore validé votre email',
    USER_NOT_EXIST: 'There is no account associated with this user',
    DEMAND_PARTICIPATION_IS_OK: 'Votre demande de participation à l\'évènement à bien été soumis à l\'organisateur',
    DEMAND_PARTICIPATION_IS_NOK: 'Une erreur est survenue pendant votre demande de participation à l\'évènement',
    ERROR_USER_EVEN_PARTICIPATION_ON_EVENT: 'Vous participez déjà à cet évènement',
    CANCEL_PARTICIPATION_ON_EVENT_OK: 'Votre participation à l\'évenement à été annulé',
    USER_NOT_REFENCY_ON_EVENT: 'Annulation impossible, Vous n\'êtes pas référencé dans l\'évenement',
    DISCONNECT_OK: 'Vous avez été déconnecté !',
    CANCEL_EVENT_NOT_AUTHORIZE: 'Vous n\'avez pas le droit de supprimer cet évènement !',
    CANCEL_EVENT_OK: 'L\'évènement à correctement été annulé',
    NO_PLACE_ON_EVENT: 'Il n\'y a plus de place pour participer à cet évènement',
    GET_USER_EVENTS_OK: 'Voici les évènements que vous avez créé et auquels vous participez',
    ERROR_EVENT_PARTICIPATION_YOU_AE_CREATOR: 'Vous ne pouvez pas participer à cet évènement car vous êtes le créateur de cet évènement',
    OBJECTID_NOT_VALID: 'L\'id de l\'utilisateur n\'est pas valide',
    EMAIL_CONFLIT: 'L\'email est le même de votre compte actuel',
    EMAIL_CHANGE_ERROR: 'Error dans l\'actualisation du email',
    EMAIL_CHANGE_SUCCESSFUL: 'L\'email de l\'utilisateur a été actualisé avec succès',
    PASSWORD_CHANGE_ERROR: 'Error dans l\'actualisation du password',
    PASSWORD_CHANGE_SUCCESSFUL: 'Le password de l\'utilisateur a été actualisé avec succès',
    USER_ACCEPTED_TO_EVENT: 'user accepté à l\'eventement',
    USER_NOT_IN_WAITING_LIST: 'User n\'est pas dans la liste d\'attente de l\'event'
  },
  EMAIL_REPLACE: {
    PSEUDO: '%%pseudo%%',
    URL_CONFIRMATION: '%%link_confirmation%%',
  },
  EMAIL_TEMPLATE: {
    PATH_CONFIRMATION_INSCRIPTION:
      './src/templates/confirmation-inscription.html',
  },
  STATUS_EVENT: {
    VALIDATE: 'Validé',
    PENDING: 'En attente de validation',
    REFUSE: 'Refusé',
  },
  uuid,
  convertDateStringToDate
});
