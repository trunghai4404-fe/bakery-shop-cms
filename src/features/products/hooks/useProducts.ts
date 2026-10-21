import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { ProductApi } from '../api/product.api';
import type {
  CreateProductRequest,
  ProductParams,
  ToggleProductRequest,
  UpdateProductRequest,
} from '../type';
import { QUERY_KEY } from '@/constants/queryKey';
import { getErrorMessage } from '@/lib/helper';

export const useProducts = (params: ProductParams) => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCTS, params],
    queryFn: async () => {
      const response = await ProductApi.getAll(params);
      return response.data;
    },
  });
};

export const useProductDetail = (id: number | null | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT_DETAIL, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await ProductApi.getById(id);
      return response.data;
    },
    enabled: !!id && typeof id === 'number' && id > 0,
  });
};

export const useProductBySlug = (slug: string | null | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT_SLUG_DETAIL, slug],
    queryFn: async () => {
      if (!slug) return null;
      const response = await ProductApi.getBySlug(slug);
      return response.data;
    },
    enabled: !!slug,
  });
};

export const useProductSearchOptions = (params: ProductParams, excludeId?: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT_ACCESSORIES_OPTIONS, params, excludeId],
    queryFn: async () => {
      const response = await ProductApi.getAll(params);
      const items = response.data?.items || [];
      return items.filter((item) => item.id !== excludeId);
    },
    staleTime: 1000 * 30,
  });
};

export const useInfiniteProductOptions = (params?: {
  search?: string;
  categoryId?: number;
  excludeId?: number;
  enabled?: boolean;
  pageSize?: number;
}) => {
  const { search, categoryId, excludeId, enabled = true, pageSize = 15 } = params || {};
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.PRODUCT_ACCESSORIES_OPTIONS, 'infinite', search, categoryId, excludeId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await ProductApi.getAll({
        search: search ? search.trim() : undefined,
        categoryId: categoryId || undefined,
        isActive: true,
        page: pageParam as number,
        pageSize,
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    enabled: enabled && (categoryId === undefined || categoryId > 0),
    staleTime: 1000 * 30,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => ProductApi.create(data),
    onSuccess: (res) => {
      if (res.success) {
        message.success('Tạo sản phẩm mới thành công!');
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCTS] });
      } else {
        message.error(res.message || 'Tạo sản phẩm thất bại!');
      }
    },
    onError: (err: any) => {
      const msg = getErrorMessage(err, 'Tạo sản phẩm thất bại!')
      message.error(msg);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) =>
      ProductApi.update(id, data),
    onSuccess: (res, variables) => {
      if (res.success) {
        message.success('Cập nhật sản phẩm thành công!');
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCTS] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCT_DETAIL, variables.id] });
      } else {
        message.error(res.message || 'Cập nhật sản phẩm thất bại!');
      }
    },
    onError: (err: any) => {
      const msg = getErrorMessage(err, 'Cập nhật sản phẩm thất bại!')
      message.error(msg);
    },
  });
};

export const useToggleProductActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: ToggleProductRequest }) =>
      ProductApi.toggleActive(id, data),
    onSuccess: (res, variables) => {
      if (res.success) {
        message.success('Cập nhật trạng thái sản phẩm thành công!');
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCTS] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCT_DETAIL, variables.id] });
      } else {
        message.error(res.message || 'Cập nhật trạng thái thất bại!');
      }
    },
    onError: (err: any) => {
      const msg = getErrorMessage(err, 'Cập nhật trạng thái thất bại!')
      message.error(msg);
    },
  });
};
