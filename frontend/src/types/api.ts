/** Envelope padrão de página do Spring Data (Pageable). */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // página atual (0-indexed)
  size: number;
  first: boolean;
  last: boolean;
}

/** Corpo de erro devolvido pelo GlobalExceptionHandler do backend. */
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  /** Cada item vem como "campo: mensagem" (ex: "email: E-mail inválido"). */
  details?: string[];
}
