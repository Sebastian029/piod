# AuthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authRegisterCreate**](#authregistercreate) | **POST** /api/auth/register/ | |
|[**tokenCreate**](#tokencreate) | **POST** /api/token/ | |
|[**tokenRefreshCreate**](#tokenrefreshcreate) | **POST** /api/token/refresh/ | |

# **authRegisterCreate**
> SimpleDetailResponse authRegisterCreate(register)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    Register
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let register: Register; //

const { status, data } = await apiInstance.authRegisterCreate(
    register
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **register** | **Register**|  | |


### Return type

**SimpleDetailResponse**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tokenCreate**
> TokenObtainResponse tokenCreate(tokenObtainRequest)

Custom view for obtaining JWT tokens with additional schema annotations.

### Example

```typescript
import {
    AuthApi,
    Configuration,
    TokenObtainRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let tokenObtainRequest: TokenObtainRequest; //

const { status, data } = await apiInstance.tokenCreate(
    tokenObtainRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tokenObtainRequest** | **TokenObtainRequest**|  | |


### Return type

**TokenObtainResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tokenRefreshCreate**
> TokenRefreshResponse tokenRefreshCreate(tokenRefreshRequest)

Custom view for obtaining refresh tokens with additional schema annotations.

### Example

```typescript
import {
    AuthApi,
    Configuration,
    TokenRefreshRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let tokenRefreshRequest: TokenRefreshRequest; //

const { status, data } = await apiInstance.tokenRefreshCreate(
    tokenRefreshRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tokenRefreshRequest** | **TokenRefreshRequest**|  | |


### Return type

**TokenRefreshResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

