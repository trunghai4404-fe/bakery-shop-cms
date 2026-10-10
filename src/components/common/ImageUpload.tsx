import React, { useState } from 'react';
import { Upload, Button, Modal, message, Tooltip } from 'antd';
import {
    UploadOutlined,
    DeleteOutlined,
    EyeOutlined,
    CloudUploadOutlined,
} from '@ant-design/icons';
import { useUploadFile } from '@/hooks/useUploadFile';
import { appImages } from '@/constants/app-infor';

interface ImageUploadProps {
    value?: string;
    onChange?: (url: string) => void;
    placeholder?: string;
    maxSizeMB?: number;
    className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    placeholder = 'Chọn hoặc kéo thả hình ảnh vào đây',
    maxSizeMB = 5,
    className = '',
}) => {
    const { uploadSingleFile, isUploading } = useUploadFile();
    const [previewOpen, setPreviewOpen] = useState(false);

    const handleBeforeUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Chỉ được phép tải lên tệp hình ảnh (JPG, PNG, WEBP)!');
            return Upload.LIST_IGNORE;
        }

        const isLtMax = file.size / 1024 / 1024 < maxSizeMB;
        if (!isLtMax) {
            message.error(`Dung lượng hình ảnh không được vượt quá ${maxSizeMB}MB!`);
            return Upload.LIST_IGNORE;
        }

        return true;
    };

    const handleCustomRequest = async ({ file }: any) => {
        const fileObj = file as File;
        const url = await uploadSingleFile(fileObj);
        if (url && onChange) {
            onChange(url);
        }
    };

    const handleRemove = () => {
        if (onChange) {
            onChange('');
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {value ? (
                <div className="relative group rounded-xl border border-stone-200 bg-stone-50 p-3 transition-all hover:shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-stone-300 bg-stone-200">
                            <img
                                src={value}
                                alt="Uploaded preview"
                                className="w-full h-full object-cover object-center"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = appImages.placeholder;
                                }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Tooltip title="Xem ảnh">
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<EyeOutlined className="text-white text-base" />}
                                        onClick={() => setPreviewOpen(true)}
                                    />
                                </Tooltip>
                            </div>
                        </div>

                        <div className="flex-1 min-w-0 pr-2">
                            <p className="text-xs font-semibold text-stone-700 truncate mb-1" title={value}>
                                {value.split('/').pop() || 'image.jpg'}
                            </p>
                            <p className="text-[11px] text-stone-400 truncate font-mono mb-2" title={value}>
                                {value}
                            </p>
                            <div className="flex items-center gap-2">
                                <Upload
                                    customRequest={handleCustomRequest}
                                    beforeUpload={handleBeforeUpload}
                                    showUploadList={false}
                                    accept="image/*"
                                    disabled={isUploading}
                                >
                                    <Button size="small" icon={<UploadOutlined />} loading={isUploading}>
                                        Đổi ảnh khác
                                    </Button>
                                </Upload>
                                <Button
                                    size="small"
                                    danger
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    onClick={handleRemove}
                                    disabled={isUploading}
                                >
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <Upload.Dragger
                        customRequest={handleCustomRequest}
                        beforeUpload={handleBeforeUpload}
                        showUploadList={false}
                        accept="image/*"
                        disabled={isUploading}
                        className="bg-stone-50 rounded-xl transition-all p-4"
                    >
                        <div className="flex flex-col items-center justify-center py-2 text-stone-500">
                            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-2 text-2xl shadow-xs">
                                <CloudUploadOutlined />
                            </div>
                            <p className="text-sm font-semibold text-stone-700 mb-1">{placeholder}</p>
                            <p className="text-xs text-stone-400 mb-3">Hỗ trợ PNG, JPG, WEBP (Tối đa {maxSizeMB}MB)</p>
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <Upload
                                    customRequest={handleCustomRequest}
                                    beforeUpload={handleBeforeUpload}
                                    showUploadList={false}
                                    accept="image/*"
                                    disabled={isUploading}
                                >
                                    <Button type="primary" icon={<UploadOutlined />} loading={isUploading} size="middle">
                                        Tải ảnh lên
                                    </Button>
                                </Upload>
                            </div>
                        </div>
                    </Upload.Dragger>
                </div>
            )}

            <Modal
                open={previewOpen}
                title="Xem trước hình ảnh"
                footer={null}
                onCancel={() => setPreviewOpen(false)}
                centered
                width={600}
            >
                <img
                    alt="preview"
                    className="w-full h-auto rounded-lg object-contain max-h-[70vh] block mx-auto"
                    src={value || appImages.placeholder}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = appImages.placeholder;
                    }}
                />
            </Modal>
        </div>
    );
};

export default ImageUpload;
