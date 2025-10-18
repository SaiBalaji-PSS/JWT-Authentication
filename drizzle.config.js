const {defineConfig} = require("drizzle-kit")
const config = defineConfig({
    out: './drizzle',
    schema: "./src/db/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: "postgres://admin:admin@localhost:5432/mydb",
    },
})
module.exports = config