import type { PaginatedResponse } from "@/core/api-response";

export interface CategoriesParams {
    search?: string;
    isActive?: boolean;
    parentId?: number;
    isRoot?: boolean;
    isFeatured?: boolean;
    sortBy?: string;
    isDescending?: boolean;
    page?: number;
    pageSize?: number;
}

export interface CategoryList {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parentId: number | null;
    parentName: string | null;
    imageUrl: string | null;
    sortOrder: number;
    isFeatured: boolean;
    isActive: boolean;
    createdAt: string;
    childrenCount: number;
}

export type CategoriesResponse = PaginatedResponse<CategoryList>;

export interface CategoryDetail {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parentId: number | null;
    parentName: string | null;
    imageUrl: string | null;
    sortOrder: number;
    isFeatured: boolean;
    isActive: boolean;
    createdAt: string;
    createdBy: string | null;
    lastModifiedAt: string | null;
    lastModifiedBy: string | null;
    children: CategoryList[];
}

export interface CreateCategory {
    name: string;
    slug?: string;
    description?: string | null;
    parentId?: number | null;
    imageUrl?: string | null;
    isFeatured?: boolean;
    isActive?: boolean;
    sortOrder?: number;
}

export interface UpdateCategory {
    name?: string;
    slug?: string;
    description?: string | null;
    parentId?: number | null;
    imageUrl?: string | null;
    isFeatured?: boolean;
    sortOrder?: number;
}

export interface ToggleCategoryRequest {
    isActive: boolean;
}

