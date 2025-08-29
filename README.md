# personal-notes-organizer-14812-14850

Notes Backend (Express.js)
- Start in development: `npm run dev` inside notes_backend
- Start in production: `npm start`
- Swagger docs: GET /docs
- Health: GET /

Environment Variables
- See notes_backend/.env.example
- Required header for notes endpoints: `x-user-id` representing the owner of notes.

Notes API
- List: GET /api/notes
- Get: GET /api/notes/{id}
- Create: POST /api/notes { title, content } + header x-user-id
- Update: PUT /api/notes/{id} { title?, content? } + header x-user-id
- Delete: DELETE /api/notes/{id} + header x-user-id