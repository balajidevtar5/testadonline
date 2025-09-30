import { FC } from 'react';
import { Button } from 'antd';
import MainLayoutComponent from '../layout/MainLayoutComponent';
import { ErrorIcon } from '../../assets/icons/ErrorIcon';

interface FallBackComponentProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const FallBackComponent: FC<FallBackComponentProps> = ({ error, resetErrorBoundary }) => {
  return (
    <MainLayoutComponent>
      {/* Main container with adjusted spacing */}
      <div
        className="position-relative top-20 overflow-y-auto mt-60 editstiper"
        style={{ paddingBottom: '100px', minHeight: 'calc(100vh - 120px)' }} // Adjusted paddingBottom and minHeight
      >
        <div role="alert" className="mt-20">
          <div className="d-flex align-items-center justify-content-center mb-25">
            <ErrorIcon height={200} width={200} />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <div className="alertTitle">Oops something went wrong!</div>
            <div className="mt-2">
              <p className="text-sm text-slate-500">
                {error.message || "An unexpected error occurred. Please try again later."}
              </p>
            </div>
          </div>
        </div>

        {/* Button container with increased bottom margin */}
        <div className="mt-5 d-flex justify-content-center">
          <Button
            type="primary"
            onClick={() => {
              resetErrorBoundary();
              localStorage.clear();
              window.location.reload();
            }}
            className="ant-btn-primary w-full"
            style={{ position: 'relative', zIndex: 1 }} // Ensures it's above the nav bar
          >
            Try Again
          </Button>
        </div>
      </div>
    </MainLayoutComponent>
  );
};

export default FallBackComponent;
