import React, { useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    FontColor,
    FontBackgroundColor,
    FontSize,
    Alignment,
    Link,
    List,
    Table,
    TableToolbar,
    BlockQuote,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    ImageResize,
    ImageInsert,
    AutoImage,
    MediaEmbed,
    Undo,
    FileRepository,
    type FileLoader,
    type UploadAdapter,
    type UploadResponse,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { ContentApi } from '@/actions/content';

export interface CKEditorCustomProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    minHeight?: number | string;
    className?: string;
}

class CustomUploadAdapter implements UploadAdapter {
    private loader: FileLoader;

    constructor(loader: FileLoader) {
        this.loader = loader;
    }

    async upload(): Promise<UploadResponse> {
        const file = await this.loader.file;
        if (!file) {
            throw new Error('Không tìm thấy file để tải lên');
        }

        const res = await ContentApi.uploadFiles(file);
        if (res.success && res.data?.urls && res.data.urls.length > 0) {
            return {
                default: res.data.urls[0],
            };
        }

        throw new Error(res.message || 'Tải ảnh lên thất bại');
    }

    abort(): void {}
}

function CustomUploadAdapterPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: FileLoader) => {
        return new CustomUploadAdapter(loader);
    };
}

export const CKEditorCustom: React.FC<CKEditorCustomProps> = ({
    value = '',
    onChange,
    placeholder = 'Nhập mô tả chi tiết sản phẩm, công thức, bảo quản...',
    disabled = false,
    minHeight = 240,
    className = '',
}) => {
    const editorConfig = useMemo(() => ({
        licenseKey: 'GPL' as const,
        plugins: [
            Essentials,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            FontColor,
            FontBackgroundColor,
            FontSize,
            Alignment,
            Link,
            List,
            Table,
            TableToolbar,
            BlockQuote,
            Image,
            ImageCaption,
            ImageStyle,
            ImageToolbar,
            ImageUpload,
            ImageResize,
            ImageInsert,
            AutoImage,
            MediaEmbed,
            Undo,
            FileRepository,
        ],
        extraPlugins: [CustomUploadAdapterPlugin],
        toolbar: [
            'undo',
            'redo',
            '|',
            'heading',
            '|',
            'fontSize',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            '|',
            'alignment',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'link',
            'insertImage',
            'insertTable',
            'blockQuote',
            'mediaEmbed',
        ],
        heading: {
            options: [
                { model: 'paragraph' as const, title: 'Đoạn văn (Paragraph)', class: 'ck-heading_paragraph' },
                { model: 'heading1' as const, view: 'h1', title: 'Tiêu đề 1 (H1)', class: 'ck-heading_heading1' },
                { model: 'heading2' as const, view: 'h2', title: 'Tiêu đề 2 (H2)', class: 'ck-heading_heading2' },
                { model: 'heading3' as const, view: 'h3', title: 'Tiêu đề 3 (H3)', class: 'ck-heading_heading3' },
            ],
        },
        image: {
            toolbar: [
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
                '|',
                'toggleImageCaption',
                'imageTextAlternative',
                '|',
                'resizeImage',
            ],
        },
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
        },
        placeholder,
    }), [placeholder]);

    const minHeightStyle = typeof minHeight === 'number' ? `${minHeight}px` : minHeight;

    return (
        <div
            className={`ckeditor-custom-wrapper ${className}`}
            style={{ '--ckeditor-min-height': minHeightStyle } as React.CSSProperties}
        >
            <CKEditor
                editor={ClassicEditor}
                data={value || ''}
                disabled={disabled}
                config={editorConfig}
                onChange={(_event, editor) => {
                    const data = editor.getData();
                    onChange?.(data);
                }}
            />
        </div>
    );
};

export default CKEditorCustom;
