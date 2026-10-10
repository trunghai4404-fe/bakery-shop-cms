import { ApiRoutes } from "@/constants/api-routes";
import type {
  CategoriesParams,
  CategoriesResponse,
  CategoryDetail,
  CategoryList,
  CreateCategory,
  ToggleCategoryRequest,
  UpdateCategory,
} from "../type";
import callApi from "@/core/handleApi";

export const CategoriesApi = {
  getAll: async (params: CategoriesParams) => {
    const searchParams = new URLSearchParams();
    if (params.search) {
      searchParams.append("search", params.search);
    }
    if (params.isActive !== undefined) {
      searchParams.append("isActive", params.isActive.toString());
    }
    if (params.parentId !== undefined) {
      searchParams.append("parentId", params.parentId.toString());
    }
    if (params.isRoot !== undefined) {
      searchParams.append("isRoot", params.isRoot.toString());
    }
    if (params.isFeatured !== undefined) {
      searchParams.append("isFeatured", params.isFeatured.toString());
    }
    if (params.sortBy) {
      searchParams.append("sortBy", params.sortBy);
    }
    if (params.isDescending !== undefined) {
      searchParams.append("isDescending", params.isDescending.toString());
    }
    if (params.page !== undefined) {
      searchParams.append("page", params.page.toString());
    }
    if (params.pageSize !== undefined) {
      searchParams.append("pageSize", params.pageSize.toString());
    }

    const queryString = searchParams.toString();
    const url = queryString ? `${ApiRoutes.CATEGORIES}?${queryString}` : ApiRoutes.CATEGORIES;
    return await callApi<CategoriesResponse>(url);
  },

  getDetail: async (id: number) => {
    const url = `${ApiRoutes.CATEGORIES}/${id}`;
    return await callApi<CategoryDetail>(url);
  },

  create: async (data: CreateCategory) => {
    const url = ApiRoutes.CATEGORIES;
    return await callApi<CategoryList>(url, data, "post");
  },

  updateCategory: async (data: UpdateCategory, id: number) => {
    const url = `${ApiRoutes.CATEGORIES}/${id}`;
    return await callApi<CategoryDetail>(url, data, "put");
  },

  toggleActive: async (data: ToggleCategoryRequest, id: number) => {
    const url = `${ApiRoutes.CATEGORIES}/${id}/toggle`;
    return await callApi<boolean>(url, data, "patch");
  },

  deleteCategory: async (id: number) => {
    const url = `${ApiRoutes.CATEGORIES}/${id}`;
    return await callApi<boolean>(url, undefined, "delete");
  },
};
