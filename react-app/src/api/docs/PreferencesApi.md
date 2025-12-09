# PreferencesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**preferencesCreate**](#preferencescreate) | **POST** /api/preferences/ | |
|[**preferencesDestroy**](#preferencesdestroy) | **DELETE** /api/preferences/ | |
|[**preferencesList**](#preferenceslist) | **GET** /api/preferences/ | |
|[**preferencesPartialUpdate**](#preferencespartialupdate) | **PATCH** /api/preferences/ | |
|[**preferencesUpdate**](#preferencesupdate) | **PUT** /api/preferences/ | |

# **preferencesCreate**
> UserDietPreferences preferencesCreate()


### Example

```typescript
import {
    PreferencesApi,
    Configuration,
    UserDietPreferences
} from './api';

const configuration = new Configuration();
const apiInstance = new PreferencesApi(configuration);

let userDietPreferences: UserDietPreferences; // (optional)

const { status, data } = await apiInstance.preferencesCreate(
    userDietPreferences
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userDietPreferences** | **UserDietPreferences**|  | |


### Return type

**UserDietPreferences**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |
|**400** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **preferencesDestroy**
> SimpleDetailResponse preferencesDestroy()


### Example

```typescript
import {
    PreferencesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PreferencesApi(configuration);

const { status, data } = await apiInstance.preferencesDestroy();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**SimpleDetailResponse**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** |  |  -  |
|**404** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **preferencesList**
> Array<UserDietPreferences> preferencesList()


### Example

```typescript
import {
    PreferencesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PreferencesApi(configuration);

const { status, data } = await apiInstance.preferencesList();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<UserDietPreferences>**

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

# **preferencesPartialUpdate**
> UserDietPreferences preferencesPartialUpdate()


### Example

```typescript
import {
    PreferencesApi,
    Configuration,
    PatchedUserDietPreferences
} from './api';

const configuration = new Configuration();
const apiInstance = new PreferencesApi(configuration);

let patchedUserDietPreferences: PatchedUserDietPreferences; // (optional)

const { status, data } = await apiInstance.preferencesPartialUpdate(
    patchedUserDietPreferences
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **patchedUserDietPreferences** | **PatchedUserDietPreferences**|  | |


### Return type

**UserDietPreferences**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**404** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **preferencesUpdate**
> UserDietPreferences preferencesUpdate()


### Example

```typescript
import {
    PreferencesApi,
    Configuration,
    UserDietPreferences
} from './api';

const configuration = new Configuration();
const apiInstance = new PreferencesApi(configuration);

let userDietPreferences: UserDietPreferences; // (optional)

const { status, data } = await apiInstance.preferencesUpdate(
    userDietPreferences
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userDietPreferences** | **UserDietPreferences**|  | |


### Return type

**UserDietPreferences**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**404** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

