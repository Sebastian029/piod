import { 
  AuthApi, 
  PlansApi, 
  PreferencesApi, 
  RecipesApi, 
  UserApi, 
  DietExcludedApi,
  DietsApi,
  IngredientsApi
} from "./api";
import { Configuration } from "./configuration";
import axiosInstance from "./axiosInstance";

const config = new Configuration({
  baseOptions: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

const auth = new AuthApi(config, axiosInstance.defaults.baseURL, axiosInstance)
const user = new UserApi(config, axiosInstance.defaults.baseURL, axiosInstance)
const plans = new PlansApi(config, axiosInstance.defaults.baseURL, axiosInstance)
const preferences = new PreferencesApi(config, axiosInstance.defaults.baseURL, axiosInstance)
const recipes = new RecipesApi(config, axiosInstance.defaults.baseURL, axiosInstance)
const dietExcluded = new DietExcludedApi(config, axiosInstance.defaults.baseURL, axiosInstance)
const diets = new DietsApi(config, axiosInstance.defaults.baseURL, axiosInstance)
const ingredients = new IngredientsApi(config, axiosInstance.defaults.baseURL, axiosInstance)

const MealPlanApi = { auth, user, plans, preferences, recipes, dietExcluded, diets, ingredients }


export * from "./api";
export * from "./configuration";
export { MealPlanApi }