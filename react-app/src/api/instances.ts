import { AuthApi, PlansApi, PreferencesApi, RecipesApi } from "./api";
import { Configuration } from "./configuration";


const config = new Configuration({
  basePath: 'http://127.0.0.1:8000',
  baseOptions: {
    headers: {
      // 'Authorization': 'Bearer YOUR_TOKEN_HERE',
      'Content-Type': 'application/json',
    },
  },
  //TODO get from localStorage
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MTExNTIwLCJpYXQiOjE3NjQxMDc5MjAsImp0aSI6ImZjYmMxNDI2NDU4YzRhMmU5ZDRiNDA3N2MzYTQ2ODZiIiwidXNlcl9pZCI6IjEifQ.EGC1V0t9JwsW-KM7WuF2kZro3iQjbyZL7gyJ4GcdrXE'
});

const auth = new AuthApi(config)
const plans = new PlansApi(config)
const preferences = new PreferencesApi(config)
const recipes = new RecipesApi(config)

const MealPlanApi = { auth, plans, preferences, recipes }

export { MealPlanApi }