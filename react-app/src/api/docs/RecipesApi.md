# RecipesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**recipesDeleteAllDestroy**](#recipesdeletealldestroy) | **DELETE** /api/recipes/delete-all/ | |
|[**recipesList**](#recipeslist) | **GET** /api/recipes/ | |
|[**recipesLoadCreate**](#recipesloadcreate) | **POST** /api/recipes/load/ | |
|[**recipesRetrieve**](#recipesretrieve) | **GET** /api/recipes/{id}/ | |

# **recipesDeleteAllDestroy**
> DeleteAllRecipesResponse recipesDeleteAllDestroy()


### Example

```typescript
import {
    RecipesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecipesApi(configuration);

const { status, data } = await apiInstance.recipesDeleteAllDestroy();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**DeleteAllRecipesResponse**

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

# **recipesList**
> Array<Recipe> recipesList()


### Example

```typescript
import {
    RecipesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecipesApi(configuration);

const { status, data } = await apiInstance.recipesList();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Recipe>**

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

# **recipesLoadCreate**
> UploadRecipesResponse recipesLoadCreate()


### Example

```typescript
import {
    RecipesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecipesApi(configuration);

const { status, data } = await apiInstance.recipesLoadCreate();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UploadRecipesResponse**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |
|**400** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **recipesRetrieve**
> Recipe recipesRetrieve()


### Example

```typescript
import {
    RecipesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecipesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.recipesRetrieve(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**Recipe**

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

