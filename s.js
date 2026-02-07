// app.put('/users/:value', (req, res) => {
//   const { value } = req.params
//   let { nick } = req.body

//   // ✅ Find user by id OR nick
//   const user = users.find(
//     (u) => u.id === Number(value) || u.nick.toLowerCase() === value.toLowerCase()
//   )

//   if (!user) {
//     return res.status(404).json({ message: "User not found" })
//   }

//   // ✅ If nick provided → validate it
//   if (nick !== undefined) {
//     if (typeof nick !== "string" || !nick.trim()) {
//       return res.status(400).json({ message: "nick must be a non-empty string" })
//     }

//     nick = nick.trim()

//     // ✅ Nick must be unique (ignore current user)
//     const nickExists = users.some(
//       (u) => u.id !== user.id && u.nick.toLowerCase() === nick.toLowerCase()
//     )

//     if (nickExists) {
//       return res.status(409).json({ message: "User with this nick already exists" })
//     }

//     user.nick = nick
//   }

//   res.json({
//     message: "User updated",
//     user,
//   })
// })