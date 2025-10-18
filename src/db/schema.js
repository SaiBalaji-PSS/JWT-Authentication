const { pgTable } = require("drizzle-orm/pg-core")
const {text,uuid,varchar} = require("drizzle-orm/pg-core")
const userTable = pgTable("users",{
    id: uuid().primaryKey().defaultRandom(),
    userName: varchar({length:80}).notNull(),
    email: text().notNull(),
    salt: text().notNull(),
    hashedPassword: text().notNull()
})
module.exports = {userTable}