export declare class ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}
