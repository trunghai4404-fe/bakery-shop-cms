import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { CategoriesApi } from '../api/categories.api';
import type { CategoriesParams, CreateCategory, UpdateCategory } from '../type';
import { QUERY_KEY } from '@/constants/queryKey';

export const useCategories = (params: CategoriesParams) => {
  return useQuery({
    queryKey: [QUERY_KEY.CATEGORIES, params],
    queryFn: async () => {
      const response = await CategoriesApi.getAll(params);
      return response.data;
    },
  });
};

export const useCategoryDetail = (id: number | null | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEY.CATEGORY_DETAIL, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await CategoriesApi.getDetail(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useParentCategoryOptions = (params?: { search?: string; enabled?: boolean }) => {
  const { search, enabled = true } = params || {};
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.PARENT_CATEGORIES, search],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await CategoriesApi.getAll({
        isRoot: true,
        search: search ? search.trim() : undefined,
        page: pageParam as number,
        pageSize: 10,
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    enabled,
    staleTime: 1000 * 60 * 2,
  });
};

export const useInfiniteCategories = (params?: { search?: string; enabled?: boolean; pageSize?: number }) => {
  const { search, enabled = true, pageSize = 15 } = params || {};
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.CATEGORIES, 'infinite', search],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await CategoriesApi.getAll({
        search: search ? search.trim() : undefined,
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
    enabled,
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategory) => CategoriesApi.create(data),
    onSuccess: (res) => {
      if (res.success) {
        message.success('Tạo danh mục mới thành công');
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORIES] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PARENT_CATEGORIES] });
      } else {
        message.error('Tạo danh mục thất bại');
      }
    },
    onError: (err: any) => {
      message.error(err?.message || 'Có lỗi xảy ra khi tạo danh mục!');
    },
  });
};


export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategory }) =>
      CategoriesApi.updateCategory(data, id),
    onSuccess: (res, variables) => {
      if (res.success) {
        message.success('Cập nhật danh mục thành công!');
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORIES] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY_DETAIL, variables.id] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PARENT_CATEGORIES] });
      } else {
        message.error(res.message || 'Cập nhật danh mục thất bại!');
      }
    },
    onError: (err: any) => {
      message.error(err?.message || 'Có lỗi xảy ra khi cập nhật danh mục!');
    },
  });
};

export const useToggleCategoryActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      CategoriesApi.toggleActive({ isActive }, id),
    onSuccess: (res, variables) => {
      if (res.success) {
        message.success('Cập nhật trạng thái thành công');
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORIES] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY_DETAIL, variables.id] });
      } else {
        message.error('Cập nhật trạng thái thất bại');
      }
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi cập nhật trạng thái!');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => CategoriesApi.deleteCategory(id),
    onSuccess: (res) => {
      if (res.success) {
        message.success('Xóa danh mục thành công');
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORIES] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PARENT_CATEGORIES] });
      } else {
        message.error('Xóa danh mục thất bại');
      }
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi xóa danh mục!');
    },
  });
};
