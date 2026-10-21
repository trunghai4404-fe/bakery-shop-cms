import { ApiRoutes } from "@/constants/api-routes";
import callApi from "@/core/handleApi";
import type {
  CreateProductRequest,
  ProductDetail,
  ProductParams,
  ProductResponse,
  ToggleProductRequest,
  ToggleProductResponse,
  UpdateProductRequest,
} from "../type";

export const ProductApi = {
  getAll: async (params: ProductParams) => {
    const searchParams = new URLSearchParams();

    if (params.search) {
      searchParams.append("search", params.search.trim());
    }
    if (params.categoryId !== undefined) {
      searchParams.append("categoryId", params.categoryId.toString());
    }
    if (params.categorySlug) {
      searchParams.append("categorySlug", params.categorySlug.trim());
    }
    if (params.isActive !== undefined) {
      searchParams.append("isActive", params.isActive.toString());
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
    const url = queryString ? `${ApiRoutes.PRODUCTS}?${queryString}` : ApiRoutes.PRODUCTS;
    return await callApi<ProductResponse>(url);
  },

  getById: async (id: number) => {
    const url = `${ApiRoutes.PRODUCTS}/${id}`;
    return await callApi<ProductDetail>(url);
  },

  getBySlug: async (slug: string) => {
    const url = `${ApiRoutes.PRODUCTS}/${slug}`;
    return await callApi<ProductDetail>(url);
  },

  create: async (data: CreateProductRequest) => {
    const url = ApiRoutes.PRODUCTS;
    return await callApi<ProductDetail>(url, data, "post");
  },

  update: async (id: number, data: UpdateProductRequest) => {
    const url = `${ApiRoutes.PRODUCTS}/${id}`;
    return await callApi<ProductDetail>(url, data, "put");
  },

  toggleActive: async (id: number, data?: ToggleProductRequest) => {
    const url = `${ApiRoutes.PRODUCTS}/${id}/toggle`;
    return await callApi<ToggleProductResponse>(url, data ?? {}, "patch");
  },
};
