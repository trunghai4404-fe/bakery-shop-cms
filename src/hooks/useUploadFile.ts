import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { ContentApi } from "@/actions/content";

export const useUploadFile = () => {
    const uploadMutation = useMutation({
        mutationFn: (files: File[] | File) => ContentApi.uploadFiles(files),
    });

    const uploadSingleFile = async (file: File): Promise<string | null> => {
        try {
            const res = await uploadMutation.mutateAsync(file);
            if (res.success && res.data?.urls && res.data.urls.length > 0) {
                message.success("Tải ảnh lên thành công");
                return res.data.urls[0];
            }
            message.error(res.message || "Tải ảnh lên thất bại");
            return null;
        } catch (error: any) {
            message.error(error?.response?.data?.message || error?.message || "Tải ảnh lên thất bại");
            return null;
        }
    };

    const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
        try {
            const res = await uploadMutation.mutateAsync(files);
            if (res.success && res.data?.urls) {
                message.success(`Tải thành công ${res.data.urls.length} hình ảnh`);
                return res.data.urls;
            }
            message.error(res.message || "Tải ảnh lên thất bại");
            return [];
        } catch (error: any) {
            message.error(error?.response?.data?.message || error?.message || "Tải ảnh lên thất bại");
            return [];
        }
    };

    return {
        uploadMutation,
        isUploading: uploadMutation.isPending,
        uploadSingleFile,
        uploadMultipleFiles,
    };
};

export const useUpload = useUploadFile;
export default useUploadFile;