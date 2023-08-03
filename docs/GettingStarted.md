# Getting Started

## Step 1. Sign up for a account

Visit TODO and create an account.

## Step 2. Install the client SDK

Install the AuthPortal for Firebase SDK via your package manager:

```
npm install @authportal/firebase
```

or

```
yarn add @authportal/firebase
```

## Step 3. Initialize the library

Create a new AuthPortal instance and export the result so you can use it in your app.

`authPortal.js`

```js
import { AuthPortal } from "@authportal/firebase";

export const authPortal = new AuthPortal({
  client_id: "<your client id>",
  domain: "<your authportal domain>",
  redirect_path: "/signin-authportal",
});
```

## Step 4: Add a sign-in button

Create a button somewhere on your site to call `authPortalsignInWithRedirect`:

The implementation depends on your UI library, here's an example for React:

`LoginButton.js`
```jsx
import { authPortal } from "./authPortal";

const LogInButton = () => {
  return <button onClick={authPortal.signInWithRedirect}>Log In</button>;
};
```

## Step 4: Handle Redirects

Create a page under `/signin-authportal` (you can change the `redirect_path` to your liking). On this page, call `authPortal.getRedirectResult`:


`pages/signin-authportal.js`
```jsx
import { authPortal } from "./authPortal";

// on page load:
authPortal
  .getRedirectResult({ firebase_auth: getAuth(app) }) // pass the firebase auth app
  .then(({ user, return_to }) => {
    // return_to is the URL where the button was clicked, return the user back there
    // the method you use for the redirect depends on your web framework

    // simple example
    window.location.replace(return_to);
  })
  .catch((e) => {
    // something unexpected happened, display an error
    window.body.innerText = "An unexpected error occured: " + e.message;
  });
```
