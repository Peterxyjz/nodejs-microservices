export interface ServiceRoute {
  prefix: string; // Tiền tố URL (ví dụ: /api/users)
  target: string; // URL đích (ví dụ: http://localhost:3001)
  pathRewrite?: Record<string, string>; // Quy tắc viết lại path
}

export interface AppError extends Error {
  statusCode?: number; // Mã lỗi HTTP
}
