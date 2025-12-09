# IngredientsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**ingredientsRetrieve**](#ingredientsretrieve) | **GET** /api/ingredients/ | |

# **ingredientsRetrieve**
> IngredientsResponse ingredientsRetrieve()


### Example

```typescript
import {
    IngredientsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new IngredientsApi(configuration);

let mode: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.ingredientsRetrieve(
    mode
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **mode** | [**string**] |  | (optional) defaults to undefined|


### Return type

**IngredientsResponse**

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

