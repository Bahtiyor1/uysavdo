const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "House API",
      version: "1.0.0",
      description: "Backend API documentation",
    },
    tags: [
      { name: "Auth", description: "Register & Login" },
      { name: "Houses", description: "Houses endpoints" },
    ],
  },

  // ⚠️ ОЧЕНЬ ВАЖНО:
  // указываем ТОЛЬКО реальные файлы, не папки
  apis: [
    path.join(__dirname, "server.js"),
  ],
};

module.exports = swaggerJsdoc(options);
