# WeeklyMealPlan


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**start_date** | **string** |  | [default to undefined]
**end_date** | **string** |  | [default to undefined]
**score** | **number** |  | [optional] [default to undefined]
**days** | [**Array&lt;DailyMeal&gt;**](DailyMeal.md) |  | [readonly] [default to undefined]
**weekly_totals** | **{ [key: string]: number; }** |  | [readonly] [default to undefined]

## Example

```typescript
import { WeeklyMealPlan } from './api';

const instance: WeeklyMealPlan = {
    start_date,
    end_date,
    score,
    days,
    weekly_totals,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
