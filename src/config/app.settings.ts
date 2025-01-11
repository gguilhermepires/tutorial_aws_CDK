// src/config/app.setting.ts

export const AppSettings = {
    environment: process.env.NODE_ENV || "development", // Pega a variável NODE_ENV ou define como 'development'
    tableName: process.env.TABLE_NAME || "DefaultTableName",
    apiPrefix: process.env.API_PREFIX || "/api",
  };
  