# DietsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**dietsRetrieve**](#dietsretrieve) | **GET** /api/diets/ | |

# **dietsRetrieve**
> DietTypesResponse dietsRetrieve()


### Example

```typescript
import {
    DietsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DietsApi(configuration);

const { status, data } = await apiInstance.dietsRetrieve();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**DietTypesResponse**

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

