export interface JwtPayload {
    sub: string;        // ID del usuario
    email: string;      // Email del usuario
    roles: string[];    // Roles del usuario
    iat?: number;       // Fecha de emisión
    exp?: number;       // Fecha de expiración
  }