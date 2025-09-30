import "@fontsource/poppins";
import { ThemeProvider } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import LayoutContextProvider from "./components/layout/LayoutContext";
import MainLayoutComponent from "./components/layout/MainLayoutComponent";
import Theme from "./config/theme";

import React, { Suspense, lazy } from "react";
import { I18nextProvider } from "react-i18next";
import AppNotification from "./components/appnotification/appnotification";
import AppUpdate from "./components/appUpdate/AppUpdate";
import RouteError from "./components/error/routeError";
import AdSuccessScreen from "./components/review/review";
import ChatContainer from "./container/chat/ChatContainer";
import ErrorLogsContainer from "./container/errorlogs/ErrorLogsContainer";
import PostDetail from "./container/postDetail/PostDetailContainer";
import SettingContainer from "./container/settings/SettingContainer";
import ShortenURLContainer from "./container/Shortenurl/ShortenUrlContainer";
import StaticPhrases from "./container/staticPhrases/StaticPhrases";
import CityBasedStatistics from "./container/userStatistics/CityBasedStatistics";
import UserStatistics from "./container/userStatistics/UserStatistics";
import i18n from "./i18n";
import "./styles/global.scss";
import ChatDetail from "./features/Chat/ChatDetail";
const HomeContainer = lazy(() => import("./container/home/HomeContainer"));
const ContactUs = lazy(() => import("./components/pages/constactus"));
const AboutUs = lazy(() => import("./components/pages/aboutus"));
const PrivacyPolicy = lazy(() => import("./components/pages/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./components/pages/RefundPolicy"));
const Pricing = lazy(() => import("./components/pages/pricing"));
const TermAndCondition = lazy(
  () => import("./components/pages/tearmsandcondition")
);
const DeleteAccountPage = lazy(
  () => import("./components/pages/DeleteAccountPage")
);
const UserDetailsContainer = lazy(
  () => import("./container/userDetails/UserDetailsContainer")
);
const UserActivityContainer = lazy(
  () => import("./container/userActivity/UserActivityContainer")
);
const TransitionHistory = React.lazy(() => import("./components/Transistionhistory/Transistionhistory"));

const App = () => {
  const APP_ROUTES = [
    {
      path: "*",
      element: <RouteError />,
      title: "Not found",
      isPrivate: false,
    },
    {
      path: "/",
      element: <HomeContainer />,
      title: "Home",
      isPrivate: false,
    },
    {
      path: "/home",
      element: <HomeContainer />,
      title: "Home",
      isPrivate: false,
    },
    {
     path: "/share/:postDetailsId",
     element: <HomeContainer />,
      title: "Home",
      isPrivate: false,
    },
    {
      path: "/BETA/web/",
      element: <HomeContainer />,
      title: "Home",
      isPrivate: false,
    },
    {
      path: "/about",
      element: <AboutUs />,
      title: "AboutUs",
      isPrivate: false,
    },
    {
      path: "/policy/pricing",
      element: <Pricing />,
      title: "Pricing",
      isPrivate: false,
    },
    {
      path: "/policy/terms-condition",
      element: <TermAndCondition />,
      title: "Term And Condition",
      isPrivate: false,
    },
    {
      path: "/policy/privacy",
      element: <PrivacyPolicy />,
      title: "Privacy Policy",
      isPrivate: false,
    },
    {
      path: "/policy/refund",
      element: <RefundPolicy />,
      title: "Refund Policy",
      isPrivate: false,
    },
    {
      path: "/contact",
      element: <ContactUs />,
      title: "Contact Us",
      isPrivate: false,
    },
    {
      path: "/delete-account",
      element: <DeleteAccountPage />,
      title: "Delete account",
      isPrivate: false,
    },
    {
      path: "/user-details",
      element: <UserDetailsContainer />,
      title: "User details",
      isPrivate: false,
    },
    {
      path: "/user-activity",
      element: <UserActivityContainer />,
      title: "Activity logs",
      isPrivate: false,
    },
    {
      path: "/setting",
      element: <SettingContainer />,
      title: "Activity logs",
      isPrivate: false,
    },
    {
      path: "/static-phrases",
      element: <StaticPhrases />,
      title: "Phrases Page",
      isPrivate: false,
    },
    {
      path: "/success",
      element: <AdSuccessScreen />,
      title: "success",
      isPrivate: false,
    },
    {
      path: "/errorlogs",
      element: <ErrorLogsContainer />,
      title: "Activity logs",
      isPrivate: false,
    },
    {
      path: "/appnotification",
      element: <AppNotification />,
      title: "app notification",
      isPrivate: false
    },

    {
      path: "/update",
      element: <AppUpdate />,
      title: "App Update",
      isPrivate: false,
    },
    {
      path: "/transactionhistory",
      element: <TransitionHistory />,
      title: "transaction History",
      isPrivate: false,
    },
    {
      path: "/Post/Detail/:postId",
      element: <PostDetail />,
      title: "Post Detail",
      isPrivate: false,
    },
    {
      path: "/UserStatistics",
      element: <UserStatistics />,
      title: "UserStatistics",
      isPrivate: false,
    },
    {
      path: "/CityBasedStatistics",
      element: <CityBasedStatistics />,
      title: "CityBasedStatistics",
      isPrivate: false,
    },
    {
      path: "/ShortenUrl",
      element: <ShortenURLContainer />,
      title: "ShortenUrl",
      isPrivate: false,
    },
    {
      path: "/Chat",
      element: <ChatContainer />,
      title: "chat",
      isPrivate: false,
    },
    // {
    //   path: "/Chat/:id",
    //   element: <ChatDetail />,
    //   title: "chat",
    //   isPrivate: false,
    // },
  ];

  const RouteWithTitle = ({
    element,
    title,
  }: {
    element: JSX.Element;
    title?: string;
  }) => {
    document.title = `${title} | AdOnline.in`;
    return element;
  };

  const PrivateRoute = ({
    isPrivate,
    element,
    title,
  }: {
    isPrivate: boolean;
    element: JSX.Element;
    title: string;
  }) => {
    if (isPrivate) {
      return <Navigate to="login" replace={true} />;
    }

    if (title === "App Update") {
      return <RouteWithTitle element={element} title={title} />;
    }
    return (
      <MainLayoutComponent>
        <RouteWithTitle element={element} title={title} />
      </MainLayoutComponent>
    );
  };

  // useAppVersion();

  return (
    <ThemeProvider theme={Theme}>
      <BrowserRouter basename="/BETA/web">
        <LayoutContextProvider>
          <Routes>
            {APP_ROUTES.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  <I18nextProvider i18n={i18n}>
                    <Suspense
                      fallback={
                        <div className="h-100 w-100 d-flex justify-content-center align-items-center">
                          <div className="lazyLoading"></div>
                        </div>
                      }
                    >
                      <PrivateRoute
                        isPrivate={route.isPrivate}
                        element={route.element}
                        title={route.title}
                      />
                    </Suspense>
                  </I18nextProvider>
                }
              />
            ))}
          </Routes>
        </LayoutContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
