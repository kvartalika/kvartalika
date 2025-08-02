import type {FlatWithCategoryRequest, HomeRequest} from "../services";
import {useAuthStore} from "../store";

export const publishChecker = (data: HomeRequest | FlatWithCategoryRequest) => {
  if (useAuthStore.getState().isAuthenticated) {
    return true;
  }

  if ('flat' in data) {
    return data.flat.published ?? false;
  } else {
    return data.published ?? false;
  }
}