# PlansApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**plansByDateRetrieve**](#plansbydateretrieve) | **GET** /api/plans/by-date/ | |
|[**plansCurrentRetrieve**](#planscurrentretrieve) | **GET** /api/plans/current/ | |
|[**plansCurrentTestRetrieve**](#planscurrenttestretrieve) | **GET** /api/plans/current-test/ | |
|[**plansDayRetrieve**](#plansdayretrieve) | **GET** /api/plans/day/{date_str}/ | |
|[**plansDeleteAllDestroy**](#plansdeletealldestroy) | **DELETE** /api/plans/delete-all/ | |
|[**plansGenerateCreate**](#plansgeneratecreate) | **POST** /api/plans/generate/ | |

# **plansByDateRetrieve**
> WeeklyMealPlan plansByDateRetrieve()


### Example

```typescript
import {
    PlansApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PlansApi(configuration);

const { status, data } = await apiInstance.plansByDateRetrieve();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**WeeklyMealPlan**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **plansCurrentRetrieve**
> WeeklyMealPlan plansCurrentRetrieve()


### Example

```typescript
import {
    PlansApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PlansApi(configuration);

const { status, data } = await apiInstance.plansCurrentRetrieve();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**WeeklyMealPlan**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **plansCurrentTestRetrieve**
> WeeklyMealPlan plansCurrentTestRetrieve()


### Example

```typescript
import {
    PlansApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PlansApi(configuration);

const { status, data } = await apiInstance.plansCurrentTestRetrieve();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**WeeklyMealPlan**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **plansDayRetrieve**
> DailyMeal plansDayRetrieve()


### Example

```typescript
import {
    PlansApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PlansApi(configuration);

let dateStr: string; // (default to undefined)

const { status, data } = await apiInstance.plansDayRetrieve(
    dateStr
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dateStr** | [**string**] |  | defaults to undefined|


### Return type

**DailyMeal**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **plansDeleteAllDestroy**
> plansDeleteAllDestroy()


### Example

```typescript
import {
    PlansApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PlansApi(configuration);

const { status, data } = await apiInstance.plansDeleteAllDestroy();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | No response body |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **plansGenerateCreate**
> plansGenerateCreate()


### Example

```typescript
import {
    PlansApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PlansApi(configuration);

const { status, data } = await apiInstance.plansGenerateCreate();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | No response body |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

