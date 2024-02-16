export interface ServiceOptions {
    endpoint: string;
}

export interface UrlParam {
    paramName: string;
    index: number;
}

export enum RequestMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    SAVE = 'save',
    DELETE = 'delete',
}

export type RequestMethodVariant = RequestMethod.GET | RequestMethod.POST | RequestMethod.PUT | RequestMethod.SAVE | RequestMethod.DELETE;

export interface RequestOptions {
    headers?: {};
    method: RequestMethodVariant;
    url?: string;
    params?: { [index: string]: object };
    data?: any;
    // data?: object | FormData;
    signal?: AbortSignal;
    onUploadProgress?: Function,
    onDownloadProgress?: Function,
}

export interface RequestDecoratorMetadataData {
    parameterIndex: number;
    path: string[];
    key?: string;
}

export interface RequestDecoratorMetadata {
    [key: number]: RequestDecoratorMetadataData
}
