import type { PaginatedResponse } from "@/core/api-response";

export interface ProductImage {
    id?: number;
    productId?: number;
    desktopUrl: string;
    mobileUrl: string;
    isPrimary: boolean;
    sortOrder: number;
}

export interface ProductVariant {
    id?: number;
    productId?: number;
    name: string;
    sku: string;
    price: number;
    stockQuantity: number;
    isActive?: boolean;
    sortOrder?: number;
}

export interface ProductCategory {
    categoryId: number;
    name: string;
    slug: string;
}

export interface ProductAccessory {
    accessoryProductId: number;
    name: string;
    slug: string;
    sku: string;
    price: number;
    primaryImageUrl?: string;
    defaultQuantity: number;
    isIncluded: boolean;
    sortOrder: number;
    isMultiSelect: boolean;
    maxSelectCount?: number | null;
    isRequired: boolean;
    variants?: ProductVariant[];
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    images: ProductImage[];
    variants: ProductVariant[];
    categories: ProductCategory[];
}

export interface ProductDetail extends Product {
    createdBy?: string;
    lastModifiedAt?: string;
    lastModifiedBy?: string;
    accessories: ProductAccessory[];
}

export type ProductResponse = PaginatedResponse<Product>;

export interface ProductParams {
    search?: string;
    categoryId?: number;
    categorySlug?: string;
    isActive?: boolean;
    sortBy?: string;
    isDescending?: boolean;
    page?: number;
    pageSize?: number;
}

export interface ProductAccessoryRequest {
    accessoryProductId: number;
    defaultQuantity: number;
    isIncluded: boolean;
    sortOrder: number;
    isMultiSelect: boolean;
    maxSelectCount?: number | null;
    isRequired: boolean;
}

export interface LocalProductAccessory extends ProductAccessoryRequest {
    categoryId?: number;
    selectedProduct?: {
        id: number;
        name: string;
        sku: string;
        price: number;
    };
}

export interface CreateProductImageDto {
    id?: number;
    desktopUrl: string;
    mobileUrl: string;
    sortOrder: number;
    isPrimary: boolean;
}

export interface CreateProductVariantDto {
    id?: number;
    name: string;
    sku: string;
    price: number;
    stockQuantity: number;
    isActive?: boolean;
    sortOrder?: number;
}

export interface CreateProductRequest {
    name: string;
    sku: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
    images?: CreateProductImageDto[];
    variants?: CreateProductVariantDto[];
    categoryIds?: number[];
    accessories?: ProductAccessoryRequest[];
}

export interface UpdateProductRequest {
    name: string;
    sku: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
    images?: CreateProductImageDto[];
    variants?: CreateProductVariantDto[];
    categoryIds?: number[];
    accessories?: ProductAccessoryRequest[];
}

export interface ToggleProductRequest {
    isActive?: boolean;
}

export interface ToggleProductResponse {
    id: number;
    isActive: boolean;
}