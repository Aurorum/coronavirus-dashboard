/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, lazy, Suspense } from 'react';
import { Switch, Route, useLocation, Redirect, useParams } from 'react-router';
import Header from "components/Header";
import BackToTop from 'components/BackToTop';
import ErrorBoundary from "components/ErrorBoundary";
import useTimestamp from "hooks/useTimestamp";
import moment from "moment";
import useResponsiveLayout from "./hooks/useResponsiveLayout";
import Loading from "components/Loading";
import CookieBanner from "components/CookieBanner";
import DataPageHeader from "components/DataPageHeader";
import SideNavigation from "components/SideNavigation";
import SideNavMobile from "components/SideNavMobile";
import DashboardHeader from "components/DashboardHeader";
import './index.scss';


const
    Cases           = lazy(() => import('pages/Cases')),
    Healthcare      = lazy(() => import('pages/Healthcare')),
    Vaccinations    = lazy(() => import('pages/Vaccinations')),
    Deaths          = lazy(() => import('pages/Deaths')),
    Tests           = lazy(() => import('pages/Testing')),
    About           = lazy(() => import('pages/About')),
    Accessibility   = lazy(() => import('pages/Accessibility')),
    Cookies         = lazy(() => import('pages/Cookies')),
    ApiDocs         = lazy(() => import('pages/ApiDocs')),
    InteractiveMap  = lazy(() => import("pages/InteractiveMap")),
    WhatsNew        = lazy(() => import("pages/WhatsNew")),
    Footer          = lazy(() => import('components/Footer')),
    Download        = lazy(() => import('pages/Download')),
    Banner          = lazy(() => import('components/Banner')),
    MetricDocs      = lazy(() => import('pages/MetricDocs'));


const LastUpdateTime = () => {

    const timestamp = useTimestamp();

    return <>
        <div className={ "govuk-!-margin-top-5 govuk-!-margin-bottom-5" }
             role={ "region" }
             aria-labelledby={ "last-update" }>
            <p className={ "govuk-body-s" } id={ "last-update" }>
                Last updated on&nbsp;{
                    !timestamp
                        ? <Loading/>
                        : <time dateTime={ timestamp }>{
                            moment(timestamp)
                                .local(true)
                                .format("dddd D MMMM YYYY [at] h:mma")
                        }</time>
                }
            </p>
        </div>
    </>

}; // LastUpdateTime


const
    PathWithSideMenu = [
        "/details/",
        "/details/testing",
        "/details/cases",
        "/details/healthcare",
        "/details/deaths",
        "/details/about-data",
        "/details/download",
        "/details/whats-new"
    ];


const Navigation = ({ layout, ...props }) => {

    return layout !== "mobile"
        ? <SideNavigation {...props}/>
        : <SideNavMobile {...props}/>;

};  // MobileNavigation


const RedirectToDetails = () => {

    const urlParams = useParams();

    if ( urlParams.page.indexOf("details") < 0 ) {
        return <Redirect to={ `/details/${ urlParams.page }` }/>;
    }

    window.location.href = "/";

};  // RedirectToDetails


const App = () => {

    const { pathname } = useLocation();
    const layout = useResponsiveLayout(768);

    let hasMenu;

    useEffect(() => {

        hasMenu = PathWithSideMenu.indexOf(pathname) > -1;

    }, [ pathname ]);

    return <>
        <DataPageHeader/>
        <CookieBanner/>
        <Header/>
        { layout === "mobile" && <Navigation layout={ layout }/> }
        <Suspense fallback={ <Loading/> }><Banner/></Suspense>
        <div className={ "govuk-width-container" }>
            <LastUpdateTime/>
            <ErrorBoundary>
                <div className={ "dashboard-container" }>
                    {
                        layout === "desktop" &&
                        <div className={ "dashboard-menu" }>
                            <Switch>
                                <Route path={ "/:page" }
                                       render={ props =>
                                           <Navigation layout={ layout }{ ...props}/>
                                       }/>
                            </Switch>
                        </div>
                    }
                    <main className={ "govuk-main-wrapper" } role={ "main" } id={ 'main-content' }>
                        <DashboardHeader/>
                        <Suspense fallback={ <Loading/> }>
                            <Switch>
                                {/*<Route path="/details" exact render={ () => <Redirect to={ "/" }/> }/>*/}
                                <Route path="/details/testing" exact component={ Tests }/>
                                <Route path="/details/cases" exact component={ Cases }/>
                                <Route path="/details/healthcare" exact component={ Healthcare }/>
                                <Route path="/details/vaccinations" exact component={ Vaccinations }/>
                                <Route path="/details/deaths" exact component={ Deaths }/>
                                <Route path="/details/interactive-map/:page?" component={ InteractiveMap }/>
                                <Route path="/details/whats-new" exact component={ WhatsNew }/>
                                <Route path="/details/download" exact component={ Download }/>
                                <Route path="/details/about-data" exact component={About}/>
                        
                                {/*<Route path="/archive" component={ Archive }/>*/}
                                <Route path="/details/accessibility" exact component={ Accessibility }/>
                                <Route path="/details/cookies" exact component={ Cookies }/>
                                <Route path="/details/developers-guide" exact component={ ApiDocs }/>
                                <Route path="/metrics/:type?" exact component={ MetricDocs }/>
                                <Route path={ "/:page" } component={ RedirectToDetails }/>
                            </Switch>
                        </Suspense>
                    </main>
                </div>
            </ErrorBoundary>

            <Switch>
                {/* These back-to-top links are the 'overlay' style that stays on screen as we scroll. */ }
                <Route path="/" render={ () => <BackToTop mode={ "overlay" }/> }/>
            </Switch>

            {/* We only want back-to-top links on the main & about pages. */ }
            <Switch>
                {/* These back-to-top links are the 'inline' style that sits
                    statically between the end of the content and the footer. */ }
                <Route path="/" render={ props => <BackToTop { ...props } mode="inline"/> }/>
            </Switch>
        </div>

        <Switch>
            <Suspense fallback={ <Loading/> }>
                <Route path="/" component={ Footer }/>
            </Suspense>
        </Switch>
    </>
};  // App


export default App;
