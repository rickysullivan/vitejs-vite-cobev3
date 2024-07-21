import sitesReducer from "./sitesSlice";
import controllersReducer from "./controllersSlice";
import doorsReducer from "./doorsSlice";

export const componentReducers = {
  sites: sitesReducer,
  doors: doorsReducer,
  controllers: controllersReducer,
};
