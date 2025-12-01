# ProtectedApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**protectedRetrieve**](#protectedretrieve) | **GET** /api/protected/ | |

# **protectedRetrieve**
> protectedRetrieve()


### Example

```typescript
import {
    ProtectedApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProtectedApi(configuration);

const { status, data } = await apiInstance.protectedRetrieve();
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

