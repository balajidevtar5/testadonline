import React, { useContext } from 'react'
import HeaderComponent from '../header/HeaderComponent'
import MainLayoutStyles from "./MainLayout.module.scss"
import ErrorBoundaryWrapper from '../ErrorBoundaryWrappe'
import Header from '../header/Header'
import { useLocation } from 'react-router-dom'
import { LayoutContext } from './LayoutContext'

const MainLayoutComponent = ({ children, LayoutSidebar, ActionBar}: any) => {
    const location = useLocation();
    const { filterValue } = useContext(LayoutContext);
    const headerRoutes = [
        '/my-ads',
        '/about',
        '/contact',
        '/user-details',
        '/user-activity',
        '/setting',
        '/static-phrases',
        '/errorlogs',
        '/UserStatistics',
        '/CityBasedStatistics',
        '/ShortenUrl',
        '/delete-account',
        '/policy/refund',
        '/policy/terms-condition',
        '/policy/pricing',
        '/policy/privacy',
        '/transactionhistory'
    ];
    const shouldShowHeader = headerRoutes.some(route => location.pathname === route || location.pathname.startsWith(route)) 
    || filterValue?.UserId; 
        

    return (
        <>
            <ErrorBoundaryWrapper>
                {shouldShowHeader ? <Header /> : <HeaderComponent />}
                <div className="">
                    <div
                        className={`max-h-100 modern-scrollbar h-100 d-flex flex-column ${MainLayoutStyles.LayoutContainer__PageContent} ${window.location.pathname === "/login" ?
                            "" : "bg-skyBlue"} 
                    ${LayoutSidebar && MainLayoutStyles.LayoutContainer__MainContainerAfterSidebar}`}
                        id="page-content"
                    >
                        
                        {children}
                    </div>
                </div>
            </ErrorBoundaryWrapper>
        </>
    )
}

export default React.memo(MainLayoutComponent)