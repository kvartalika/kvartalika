# DefaultApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminContentManagersDelete**](#admincontentmanagersdelete) | **DELETE** /admin/content-managers | Удалить контент-менеджера|
|[**adminContentManagersGet**](#admincontentmanagersget) | **GET** /admin/content-managers | Получить всех контент-менеджеров|
|[**adminContentManagersPost**](#admincontentmanagerspost) | **POST** /admin/content-managers | Создать контент-менеджера|
|[**adminContentManagersPut**](#admincontentmanagersput) | **PUT** /admin/content-managers | Обновить контент-менеджера|
|[**adminLoginPost**](#adminloginpost) | **POST** /admin/login | Вход администратора|
|[**adminRegisterPost**](#adminregisterpost) | **POST** /admin/register | Регистрация администратора|
|[**adminSetupPost**](#adminsetuppost) | **POST** /admin/setup | Первичная настройка администратора|
|[**categoriesGet**](#categoriesget) | **GET** /categories | Получить список категорий|
|[**contentCategoriesDelete**](#contentcategoriesdelete) | **DELETE** /content/categories | Удалить категорию|
|[**contentCategoriesPost**](#contentcategoriespost) | **POST** /content/categories | Создать категорию|
|[**contentCategoriesPut**](#contentcategoriesput) | **PUT** /content/categories | Обновить категорию|
|[**contentDescriptionsDelete**](#contentdescriptionsdelete) | **DELETE** /content/descriptions | Удалить описание|
|[**contentDescriptionsPost**](#contentdescriptionspost) | **POST** /content/descriptions | Создать описание|
|[**contentDescriptionsPut**](#contentdescriptionsput) | **PUT** /content/descriptions | Обновить описание|
|[**contentFlatsDelete**](#contentflatsdelete) | **DELETE** /content/flats | Удалить квартиру|
|[**contentFlatsPost**](#contentflatspost) | **POST** /content/flats | Создать квартиру|
|[**contentFlatsPut**](#contentflatsput) | **PUT** /content/flats | Обновить квартиру|
|[**contentFooterPost**](#contentfooterpost) | **POST** /content/footer | Создать футер|
|[**contentFooterPut**](#contentfooterput) | **PUT** /content/footer | Обновить футер|
|[**contentHomesDelete**](#contenthomesdelete) | **DELETE** /content/homes | Удалить дом|
|[**contentHomesPost**](#contenthomespost) | **POST** /content/homes | Создать дом|
|[**contentHomesPut**](#contenthomesput) | **PUT** /content/homes | Обновить дом|
|[**contentManagerLoginPost**](#contentmanagerloginpost) | **POST** /content-manager/login | Вход контент-менеджера|
|[**contentManagerRegisterPost**](#contentmanagerregisterpost) | **POST** /content-manager/register | Регистрация контент-менеджера|
|[**contentPhotosDelete**](#contentphotosdelete) | **DELETE** /content/photos | Удалить фото|
|[**contentPhotosPost**](#contentphotospost) | **POST** /content/photos | Создать фото|
|[**contentPhotosPut**](#contentphotosput) | **PUT** /content/photos | Обновить фото|
|[**descriptionsGet**](#descriptionsget) | **GET** /descriptions | Получить список описаний|
|[**flatsGet**](#flatsget) | **GET** /flats | Получить список квартир|
|[**footerGet**](#footerget) | **GET** /footer | Получить футер|
|[**homesGet**](#homesget) | **GET** /homes | Получить список домов|
|[**photosGet**](#photosget) | **GET** /photos | Получить список фото|
|[**requestsPost**](#requestspost) | **POST** /requests | Создать заявку|
|[**searchPost**](#searchpost) | **POST** /search | Поиск домов|

# **adminContentManagersDelete**
> adminContentManagersDelete()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.adminContentManagersDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[admin_jwt](../README.md#admin_jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Удалено |  -  |
|**404** | Не найдено |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminContentManagersGet**
> adminContentManagersGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.adminContentManagersGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[admin_jwt](../README.md#admin_jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminContentManagersPost**
> adminContentManagersPost(contentManagerRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ContentManagerRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let contentManagerRequest: ContentManagerRequest; //

const { status, data } = await apiInstance.adminContentManagersPost(
    contentManagerRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **contentManagerRequest** | **ContentManagerRequest**|  | |


### Return type

void (empty response body)

### Authorization

[admin_jwt](../README.md#admin_jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Контент-менеджер создан |  -  |
|**409** | Уже существует |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminContentManagersPut**
> adminContentManagersPut(contentManagerRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ContentManagerRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let contentManagerRequest: ContentManagerRequest; //

const { status, data } = await apiInstance.adminContentManagersPut(
    id,
    contentManagerRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **contentManagerRequest** | **ContentManagerRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[admin_jwt](../README.md#admin_jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Обновлено |  -  |
|**404** | Не найдено |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminLoginPost**
> adminLoginPost(loginRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    LoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let loginRequest: LoginRequest; //

const { status, data } = await apiInstance.adminLoginPost(
    loginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginRequest** | **LoginRequest**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Успешный вход |  -  |
|**401** | Неверные учётные данные |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminRegisterPost**
> adminRegisterPost(registerRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    RegisterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let registerRequest: RegisterRequest; //

const { status, data } = await apiInstance.adminRegisterPost(
    registerRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerRequest** | **RegisterRequest**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Админ создан |  -  |
|**409** | Уже существует |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminSetupPost**
> adminSetupPost()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.adminSetupPost();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Админ создан |  -  |
|**409** | Уже существует |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **categoriesGet**
> categoriesGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.categoriesGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentCategoriesDelete**
> contentCategoriesDelete()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.contentCategoriesDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Удалено |  -  |
|**404** | Не найдено |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentCategoriesPost**
> contentCategoriesPost(categoryRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CategoryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let categoryRequest: CategoryRequest; //

const { status, data } = await apiInstance.contentCategoriesPost(
    categoryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **categoryRequest** | **CategoryRequest**|  | |


### Return type

void (empty response body)

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Категория создана |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentCategoriesPut**
> contentCategoriesPut(categoryRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CategoryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let categoryRequest: CategoryRequest; //

const { status, data } = await apiInstance.contentCategoriesPut(
    id,
    categoryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **categoryRequest** | **CategoryRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Обновлено |  -  |
|**404** | Не найдено |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentDescriptionsDelete**
> contentDescriptionsDelete()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.contentDescriptionsDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Удалено |  -  |
|**404** | Не найдено |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentDescriptionsPost**
> contentDescriptionsPost(descriptionRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DescriptionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let descriptionRequest: DescriptionRequest; //

const { status, data } = await apiInstance.contentDescriptionsPost(
    descriptionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **descriptionRequest** | **DescriptionRequest**|  | |


### Return type

void (empty response body)

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Описание создано |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentDescriptionsPut**
> contentDescriptionsPut(descriptionRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DescriptionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let descriptionRequest: DescriptionRequest; //

const { status, data } = await apiInstance.contentDescriptionsPut(
    id,
    descriptionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **descriptionRequest** | **DescriptionRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Обновлено |  -  |
|**404** | Не найдено |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentFlatsDelete**
> contentFlatsDelete()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.contentFlatsDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Удалено |  -  |
|**404** | Не найдено |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentFlatsPost**
> contentFlatsPost(flatRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    FlatRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let flatRequest: FlatRequest; //

const { status, data } = await apiInstance.contentFlatsPost(
    flatRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **flatRequest** | **FlatRequest**|  | |


### Return type

void (empty response body)

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Квартира создана |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentFlatsPut**
> contentFlatsPut(flatRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    FlatRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let flatRequest: FlatRequest; //

const { status, data } = await apiInstance.contentFlatsPut(
    id,
    flatRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **flatRequest** | **FlatRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Обновлено |  -  |
|**404** | Не найдено |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentFooterPost**
> contentFooterPost(footerRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    FooterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let footerRequest: FooterRequest; //

const { status, data } = await apiInstance.contentFooterPost(
    footerRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **footerRequest** | **FooterRequest**|  | |


### Return type

void (empty response body)

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Футер создан |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentFooterPut**
> contentFooterPut(footerRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    FooterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let footerRequest: FooterRequest; //

const { status, data } = await apiInstance.contentFooterPut(
    id,
    footerRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **footerRequest** | **FooterRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Обновлено |  -  |
|**404** | Не найдено |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentHomesDelete**
> contentHomesDelete()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.contentHomesDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Удалено |  -  |
|**404** | Не найдено |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentHomesPost**
> contentHomesPost(homeRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    HomeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let homeRequest: HomeRequest; //

const { status, data } = await apiInstance.contentHomesPost(
    homeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **homeRequest** | **HomeRequest**|  | |


### Return type

void (empty response body)

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Дом создан |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentHomesPut**
> contentHomesPut(homeRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    HomeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let homeRequest: HomeRequest; //

const { status, data } = await apiInstance.contentHomesPut(
    id,
    homeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **homeRequest** | **HomeRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Обновлено |  -  |
|**404** | Не найдено |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentManagerLoginPost**
> contentManagerLoginPost(loginRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    LoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let loginRequest: LoginRequest; //

const { status, data } = await apiInstance.contentManagerLoginPost(
    loginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginRequest** | **LoginRequest**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Успешный вход |  -  |
|**401** | Неверные учётные данные |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentManagerRegisterPost**
> contentManagerRegisterPost(registerRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    RegisterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let registerRequest: RegisterRequest; //

const { status, data } = await apiInstance.contentManagerRegisterPost(
    registerRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerRequest** | **RegisterRequest**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Контент-менеджер создан |  -  |
|**409** | Уже существует |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentPhotosDelete**
> contentPhotosDelete()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.contentPhotosDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Удалено |  -  |
|**400** | Некорректный ID |  -  |
|**404** | Не найдено |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentPhotosPost**
> RequestsPost201Response contentPhotosPost()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let photo: File; //Файл изображения (default to undefined)
let altText: string; //Альтернативный текст для изображения (optional) (default to undefined)

const { status, data } = await apiInstance.contentPhotosPost(
    photo,
    altText
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **photo** | [**File**] | Файл изображения | defaults to undefined|
| **altText** | [**string**] | Альтернативный текст для изображения | (optional) defaults to undefined|


### Return type

**RequestsPost201Response**

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Фото создано |  -  |
|**400** | Файл изображения обязателен |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentPhotosPut**
> contentPhotosPut()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let photo: File; //Файл изображения (опционально) (optional) (default to undefined)
let altText: string; //Альтернативный текст для изображения (optional) (default to undefined)

const { status, data } = await apiInstance.contentPhotosPut(
    id,
    photo,
    altText
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|
| **photo** | [**File**] | Файл изображения (опционально) | (optional) defaults to undefined|
| **altText** | [**string**] | Альтернативный текст для изображения | (optional) defaults to undefined|


### Return type

void (empty response body)

### Authorization

[content_jwt](../README.md#content_jwt)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Обновлено |  -  |
|**400** | Некорректный ID |  -  |
|**404** | Не найдено |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **descriptionsGet**
> descriptionsGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.descriptionsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **flatsGet**
> flatsGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.flatsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **footerGet**
> footerGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.footerGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **homesGet**
> homesGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.homesGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **photosGet**
> photosGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.photosGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **requestsPost**
> RequestsPost201Response requestsPost(requestCreate)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    RequestCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let requestCreate: RequestCreate; //

const { status, data } = await apiInstance.requestsPost(
    requestCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestCreate** | **RequestCreate**|  | |


### Return type

**RequestsPost201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Заявка создана |  -  |
|**400** | Некорректные данные |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchPost**
> searchPost(searchRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    SearchRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let searchRequest: SearchRequest; //

const { status, data } = await apiInstance.searchPost(
    searchRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **searchRequest** | **SearchRequest**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

