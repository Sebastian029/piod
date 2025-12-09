# Recipe


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [readonly] [default to undefined]
**name** | **string** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**meal_type** | **string** |  | [default to undefined]
**protein** | **number** |  | [optional] [default to undefined]
**carbs** | **number** |  | [optional] [default to undefined]
**fat** | **number** |  | [optional] [default to undefined]
**calories** | **number** |  | [optional] [default to undefined]
**tags** | **string** |  | [optional] [default to undefined]
**steps** | **any** |  | [optional] [default to undefined]
**n_steps** | **number** |  | [optional] [default to undefined]
**n_ingredients** | **number** |  | [optional] [default to undefined]
**ingredients** | **any** |  | [optional] [default to undefined]
**is_vegetarian** | **boolean** |  | [optional] [default to undefined]
**is_vegan** | **boolean** |  | [optional] [default to undefined]
**is_low_carb** | **boolean** |  | [optional] [default to undefined]
**is_gluten_free** | **boolean** |  | [optional] [default to undefined]
**is_keto** | **boolean** |  | [optional] [default to undefined]
**is_pescetarian** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { Recipe } from './api';

const instance: Recipe = {
    id,
    name,
    description,
    meal_type,
    protein,
    carbs,
    fat,
    calories,
    tags,
    steps,
    n_steps,
    n_ingredients,
    ingredients,
    is_vegetarian,
    is_vegan,
    is_low_carb,
    is_gluten_free,
    is_keto,
    is_pescetarian,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
