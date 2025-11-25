# PatchedUserDietPreferences


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**user** | **number** |  | [optional] [readonly] [default to undefined]
**username** | **string** |  | [optional] [readonly] [default to undefined]
**min_calories_per_day** | **number** |  | [optional] [default to undefined]
**max_calories_per_day** | **number** |  | [optional] [default to undefined]
**meals_per_day** | **number** |  | [optional] [default to undefined]
**min_protein_per_day** | **number** |  | [optional] [default to undefined]
**max_protein_per_day** | **number** |  | [optional] [default to undefined]
**min_carbs_per_day** | **number** |  | [optional] [default to undefined]
**max_carbs_per_day** | **number** |  | [optional] [default to undefined]
**min_fat_per_day** | **number** |  | [optional] [default to undefined]
**max_fat_per_day** | **number** |  | [optional] [default to undefined]
**allergens** | **any** |  | [optional] [default to undefined]
**excluded_ingredients** | **any** |  | [optional] [default to undefined]
**diet_type** | [**DietTypeEnum**](DietTypeEnum.md) |  | [optional] [default to undefined]

## Example

```typescript
import { PatchedUserDietPreferences } from './api';

const instance: PatchedUserDietPreferences = {
    user,
    username,
    min_calories_per_day,
    max_calories_per_day,
    meals_per_day,
    min_protein_per_day,
    max_protein_per_day,
    min_carbs_per_day,
    max_carbs_per_day,
    min_fat_per_day,
    max_fat_per_day,
    allergens,
    excluded_ingredients,
    diet_type,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
