import { ApiRoutes } from "@/constants/api-routes";
import callApi from "@/core/handleApi";

export interface UploadFilesResponse {
    urls: string[];
}

export const ContentApi = {
    uploadFiles: (files: File[] | File) => {
        const formData = new FormData();
        const fileList = Array.isArray(files) ? files : [files];
        fileList.forEach((file) => {
            formData.append('files', file);
        });
        const url = `${ApiRoutes.CONTENTS}/files`;
        return callApi<UploadFilesResponse>(url, formData, 'post');
    },
};
