# SkillBridge customer frontend

Customer-side React UI built with Vite, JavaScript/JSX, CSS, React Router, and Lucide icons.

## Run locally

```bash
npm install
npm run dev
```

## Firebase handoff

No Firebase configuration, `.env` file, authentication implementation, Firestore code, or payment implementation exists in this project. The clear frontend integration boundary is [`src/services/integrations.js`](src/services/integrations.js). Replace those gateway functions with the backend team's Firebase integrations.

`Remember me` persists only the customer’s checkbox preference in browser storage and passes it into `authGateway.login(email, password, rememberMe)`. Login persistence itself is owned by the Firebase Authentication integration.

## Illustration credits

The plumber, cleaner, and mechanic service illustrations are public-domain OpenClipart artwork. Sources: [Plumber](https://openclipart.org/detail/276118/plumber), [Window Cleaner](https://openclipart.org/detail/300832/window-cleaner), and [Mechanic](https://openclipart.org/detail/17436/mechanic).
