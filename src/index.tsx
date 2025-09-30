import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import * as Sentry from "@sentry/react";
import './i18n';
import { LOGEVENTCALL } from './libs/constant';

// Check if cookies are already accepted
const checkCookieConsent = () => {
  return document.cookie.includes('cookiesAccepted=true');
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

if(LOGEVENTCALL){
Sentry.init({
  dsn: "https://d42e732f6eb66ecfb8a6a27581fecaff@o4508363913428992.ingest.us.sentry.io/4508363982569472",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  tracePropagationTargets: ["Production", /^https:\/\/adonline\/api/],
  replaysSessionSampleRate: 0.1, 
  replaysOnErrorSampleRate: 1.0,
});
}

function Root() {
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>(checkCookieConsent());

  const handleConsent = () => {
    setCookiesAccepted(true); // Set consent state to true
  };

  return (
    <Provider store={store}>
        <App />
    </Provider>
  );
}

root.render(
  <Root />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
