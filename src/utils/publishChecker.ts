import type {FlatWithCategoryRequest, HomeRequest} from "../services";
import {useAuthStore} from "../store";

export const publishChecker = (data: HomeRequest | FlatWithCategoryRequest) => {
  return "published" in data || useAuthStore.getState().isAuthenticated;
}