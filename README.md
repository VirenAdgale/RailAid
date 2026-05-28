
RailAid
=======

Full-stack passenger assistance app with realtime mobility assignment, staff
dashboard updates, ML service recommendations, and chatbot support.

Deployment
----------

Chosen deployment stack:

- Frontend: Vercel
- Backend: Render
- ML recommendation API: Render
- Chatbot API: Render
- Database: MongoDB Atlas

1. Create a MongoDB Atlas cluster and copy the connection string.
2. Push this repository to GitHub.
3. In Render, create a new Blueprint from the GitHub repository. Render will use
   `render.yaml` to create:
   - `railaid-backend`
   - `railaid-ml`
   - `railaid-chatbot`
4. In Render, set backend environment variables:
   - `MONGO_URI`: your MongoDB Atlas connection string
   - `CORS_ORIGIN`: your final Vercel frontend URL
   - `ML_SERVICE_URL`: `https://railaid-ml.onrender.com/predict`
   - `JWT_SECRET`: generated automatically by the blueprint, or set your own
5. In Vercel, import the same GitHub repository and keep the root directory as
   the repository root. Vercel will use `vercel.json`.
6. In Vercel, set frontend environment variables:
   - `VITE_BACKEND_ORIGIN=https://railaid-backend.onrender.com`
   - `VITE_BOOKING_API_URL=https://railaid-backend.onrender.com/api/bookings`
   - `VITE_SOCKET_SERVER_URL=https://railaid-backend.onrender.com`
   - `VITE_STAFF_MOBILITY_STREAM_URL=https://railaid-backend.onrender.com/api/staff/mobility-stream`
   - `VITE_CHATBOT_ORIGIN=https://railaid-chatbot.onrender.com`
   - `VITE_CHATBOT_API_URL=https://railaid-chatbot.onrender.com/chat`
7. Deploy the backend services first, then deploy the frontend.

Health checks:

- Backend: `/api/health`
- ML API: `/health`
- Chatbot API: `/health`
