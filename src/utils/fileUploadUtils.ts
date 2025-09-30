import { message } from 'antd';
import HashMap from '../common/datastructures/hashmap';

interface FileUploadOptions {
    maxImages?: number;
    maxFileSize?: number;
    allowedExtensions?: string[];
    t?: (key: string) => string;
}

export const validateAndProcessFiles = async (
    files: FileList,
    options: FileUploadOptions = {}
): Promise<{
    isValid: boolean;
    processedFiles?: File[];
    errorMessage?: string;
}> => {
    const {
        maxImages = 8,
        maxFileSize = 10 * 1024 * 1024, // Default 10MB
        allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'],
        t = (key: string) => key
    } = options;

    if (!files || files.length === 0) {
        return { isValid: false, errorMessage: t('toastMessage.No files selected') };
    }

    const unsupportedFiles: string[] = [];
    const oversizedFiles: string[] = [];

    for (const file of Array.from(files)) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        // Check file extension
        if (fileExtension === 'webp') {
            return {
                isValid: false,
                errorMessage: t("toastMessage.WEBP files are not allowed.")
            };
        }

        if (!allowedExtensions.includes(fileExtension)) {
            unsupportedFiles.push(file.name);
        }

        // Check file size
        if (file.size > maxFileSize) {
            oversizedFiles.push(file.name);
        }
    }

    // Create error messages
    const errorMessages = [];
    if (unsupportedFiles.length) {
        errorMessages.push(
            `${t("toastMessage.The following files have unsupported extensions")} ${unsupportedFiles.join(', ')}`
        );
    }
    if (oversizedFiles.length) {
        errorMessages.push(
            `${t("toastMessage.The following files exceed the maximum size of 10 MB")} ${oversizedFiles.join(', ')}`
        );
    }

    if (errorMessages.length) {
        return {
            isValid: false,
            errorMessage: errorMessages.join(' ')
        };
    }

    return {
        isValid: true,
        processedFiles: Array.from(files)
    };
};

export const processImageFiles = async (
    files: File[],
    imageDeque: HashMap,
    setImageDeque: (callback: (prev: HashMap) => HashMap) => void,
    setImageMultipleData: (data: any[]) => void,
    setSelectedFileUpload: (callback: (prev: HashMap) => HashMap) => void
) => {
    // Process files and update imageDeque
    setImageDeque((prevDeque) => {
        const newHashMap = new HashMap();
        prevDeque.map.forEach((value, key) => {
            newHashMap.add(key, value);
        });

        files.forEach((file) => {
            if (file instanceof File) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newHashMap.add(file.name, reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        });
        return newHashMap;
    });

    // Update image data array
    const updatedARR = imageDeque.getAllDataWithKey().map((elm) => ({
        image: elm.value,
        id: elm.key
    }));
    setImageMultipleData(updatedARR);

    // Set selected files for upload
    setSelectedFileUpload((prevDeque) => {
        const newHashMap = new HashMap();
        prevDeque.map.forEach((file, key) => {
            newHashMap.add(key, file);
        });

        files.forEach((file) => {
            const fileKey = file.name;
            newHashMap.add(fileKey, file);
        });
        return newHashMap;
    });
}; 