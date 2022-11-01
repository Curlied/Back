const uuid = () => {
  return 'xxxxxxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

module.exports = Object.freeze({
  MESSAGE: {
    REGISTER_SUCCES:
      'Votre compte à correctement été enregistré, veuillez confirmer votre email',
    REGISTER_FAILED:
      'Une erreur est survenue pendant la procédure d\'inscription',
    EMAIL_ALSO_EXIST: 'L\'adresse email est déjà présente',
    IMAGE_USER_NOT_UPLOAD: 'L\'image de l\'utilisateur n\'as pas pû être uploadé',
    CONFIRMATION_MAIL_SUCCESS: 'Votre compte a été créée et validé avec succès',
    CONFIRMATION_MAIL_NOT_POSSIBLE: 'Il n\'y a pas d\'adresse mail à confirmer',
    CONFIRMATION_MAIL_ERROR: 'L\'actualisation de l\'adresse n\'a pas pû être réalisé',
    CONFIRMATION_EVENT_ADD: 'L\'évènement à bien été enregistrer et est en attente de validation',
    CONFIRMATION_NOT_MADE: 'Vous n\'avez pas encore validé votre email',
    USER_NOT_EXIST: 'Il n\'existe pas de compte associé à cette utilisateur',
    DEMAND_PARTICIPATION_IS_OK: 'Votre demande de participation à l\'évènement à bien été soumis à l\'organisateur',
    DEMAND_PARTICIPATION_IS_NOK: 'Une erreur est survenue pendant votre demande de participation à l\'évènement',
    ERROR_USER_EVEN_PARTICIPATION_ON_EVENT: 'Vous participez déjà a cette évènement',
    CANCEL_PARTICIPATION_ON_EVENT_OK: 'Votre participation à l\'évenement à été annulé',
    USER_NOT_REFENCY_ON_EVENT: 'Annulation impossible, Vous n\'êtes pas référencé dans l\'évenement',
    DISCONNECT_OK: 'Vous avez été déconnecté !',
    CANCEL_EVENT_NOT_AUTHORIZE: 'Vous n\'avez pas le droit de supprimer cet évènement !',
    CANCEL_EVENT_OK: 'L\'évènement à correctement été annulé',
    NO_PLACE_ON_EVENT: 'Il n\'y a plus de place pour participer à cet évènement'

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
});
