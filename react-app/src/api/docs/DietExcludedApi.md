# DietExcludedApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**dietExcludedRetrieve**](#dietexcludedretrieve) | **GET** /api/diet-excluded/ | |

# **dietExcludedRetrieve**
> DietExcludedIngredientsResponse dietExcludedRetrieve()


### Example

```typescript
import {
    DietExcludedApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DietExcludedApi(configuration);

let diet: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.dietExcludedRetrieve(
    diet
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **diet** | [**string**] |  | (optional) defaults to undefined|


### Return type

**DietExcludedIngredientsResponse**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**400** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

