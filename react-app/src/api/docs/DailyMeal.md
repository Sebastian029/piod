# DailyMeal


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [readonly] [default to undefined]
**date** | **string** |  | [default to undefined]
**day_number** | **number** |  | [default to undefined]
**recipes** | [**Array&lt;Recipe&gt;**](Recipe.md) |  | [readonly] [default to undefined]
**daily_totals** | **{ [key: string]: number; }** |  | [readonly] [default to undefined]

## Example

```typescript
import { DailyMeal } from './api';

const instance: DailyMeal = {
    id,
    date,
    day_number,
    recipes,
    daily_totals,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
