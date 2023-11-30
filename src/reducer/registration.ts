export const SET_REGISTRATION_FIELD = "SET_FIELD";
export const SET_REGISTRATION_ERROR = "SET_ERROR";
export const SET_REGISTRATION_LOADING = "SET_LOADING";
export const SET_SHOW_REGISTRATION = "SET_SHOW";
export const SET_REGISTRATION_TRANSLATION = "SET_TRANSLATIONS";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const registrationReducer = (state: any, action: any) => {
   switch (action.type) {
      case SET_REGISTRATION_FIELD:
         return {
            ...state,
            dataForm: {
               ...state.dataForm,
               [action.field]: action.value,
            },
         };
      case SET_REGISTRATION_ERROR:
         return {
            ...state,
            error: action.error,
         };
      case SET_REGISTRATION_LOADING:
         return {
            ...state,
            isLoading: action.isLoading,
            textLoading: action.textLoading,
         };
      case SET_SHOW_REGISTRATION:
         return {
            ...state,
            showRegistration: action.showRegistration,
         };
      case SET_REGISTRATION_TRANSLATION:
         return {
            ...state,
            translations: action.translations,
         };
      default:
         return state;
   }
};
