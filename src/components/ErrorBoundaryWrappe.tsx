import * as React from 'react';
import {
    ErrorBoundary,
    FallbackProps,
} from 'react-error-boundary';
import FallBackComponent from './error/FallBackComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNavigationComponent from './bottomNavigation/bottomNavigation';
import { LayoutContext } from './layout/LayoutContext';
type Props = {
    children: React.ReactNode;
};

const ErrorBoundaryWrapper = ({
    children,
}: Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {shouldHideBottomNavigation} = React.useContext(LayoutContext);
    const handleReset = () => {
        navigate(location.pathname, { replace: true });
    };
    return (
        <>
            <ErrorBoundary
                fallbackRender={({ error, resetErrorBoundary }) => (
                    <FallBackComponent
                        error={error}
                        resetErrorBoundary={resetErrorBoundary}
                    />
                )}
                onReset={() => { handleReset(); }}
                //onError={(error) => { console.log(error, "error") }}
                resetKeys={[location.pathname]}
            >
                {children}
                {!shouldHideBottomNavigation && <BottomNavigationComponent />}
            </ErrorBoundary>
        </>
    );
};

export default ErrorBoundaryWrapper;
