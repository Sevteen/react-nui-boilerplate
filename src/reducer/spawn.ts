export const SET_SPAWN_POSITIONS = "SET_SPAWN_POSITIONS";
export const SET_SPAWN_SELECTED = "SET_SPAWN_SELECTED";
export const SET_SPAWN_NEW_CHAR = "SET_SPAWN_NEW_CHAR";
export const SET_SPAWN_SHOW = "SET_SPAWN_SHOW";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const spawnReducer = (state: any, action: any) => {
   switch (action.type) {
      case "SET_SPAWN_POSITIONS":
         return { ...state, positions: action.payload };
      case "SET_SPAWN_SELECTED":
         return { ...state, selectedValue: action.payload };
      case "SET_SPAWN_NEW_CHAR":
         return { ...state, newChar: action.payload };
      case "SET_SPAWN_SHOW":
         return { ...state, show: action.payload };
      default:
         return state;
   }
};
