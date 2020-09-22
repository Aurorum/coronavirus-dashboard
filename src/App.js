/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Switch, Route, withRouter } from 'react-router';
import Header from "components/Header";
import DailySummary from 'pages/DailySummary';
// import CookieBanner from 'components/CookieBanner';
import BackToTop from 'components/BackToTop';
import ErrorBoundary from "components/ErrorBoundary";
import axios from "axios";
import URLs from "common/urls";
import moment from "moment";
import useResponsiveLayout from "./hooks/useResponsiveLayout";
import Loading from "components/Loading";
import time from "d3-scale/src/time";
import DashboardHeader from "components/DashboardHeader";
import Cases from "pages/Cases";
import Healthcare from "pages/Healthcare";
import Deaths from "pages/Deaths";
import Testing from "pages/Testing";
import About from "pages/About";
import Accessibility from "pages/Accessibility";
import Cookies from "pages/Cookies";
import ApiDocs from "pages/ApiDocs";
import Announcement from "components/Announcement";
import Footer from "components/Footer";
import SideNavigation from "components/SideNavigation";
import SideNavMobile from "components/SideNavMobile";



// const
//     DashboardHeader = lazy(() => import('components/DashboardHeader')),
//     Cases           = lazy(() => import('pages/Cases')),
//     Healthcare      = lazy(() => import('pages/Healthcare')),
//     Deaths          = lazy(() => import('pages/Deaths')),
//     Testing         = lazy(() => import('pages/Testing')),
//     About           = lazy(() => import('pages/About')),
//     Accessibility   = lazy(() => import('pages/Accessibility')),
//     Cookies         = lazy(() => import('pages/Cookies')),
//     ApiDocs         = lazy(() => import('pages/ApiDocs')),
//     Announcement    = lazy(() => import("components/Announcement")),
//     Footer          = lazy(() => import('components/Footer'));


const useTimestamp = () => {

    const [ timestamp, setTimestamp ] = useState("");

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(URLs.timestamp, { responseType: 'text' })
            setTimestamp(data)
        })();
    }, []);

    return timestamp

};  // useTimestamp


const LastUpdateTime = () => {

    const timestamp = useTimestamp();

    const tmStart = moment(timestamp).local(true);
    const tmEnd = moment(timestamp).local(true).add(15, 'minute');

    const parsedTimestamp = {
        start: {
            year: tmStart.year(),
            month: tmStart.month(),
            day: tmStart.date(),
            hour: tmStart.hour(),
            minute: tmStart.minute()
        },
        end: {
            year: tmEnd.year(),
            month: tmEnd.month(),
            day: tmEnd.date(),
            hour: tmEnd.hour(),
            minute: tmEnd.minute()
        },
        endTimestamp: tmEnd
            .format("h:mma")
    };

    return <>
        {/*<Suspense fallback={ <Loading/> }>*/}
            {/*{ parsedTimestamp.start.day === 13*/}
            {/*    ? <Announcement firstDisplayDate={ parsedTimestamp.start }*/}
            {/*              lastDisplayDate={{ year: 2020, month: 9, day: 15, hour: 16 }}>*/}
            {/*    <p className={ "govuk-body" }>*/}
            {/*        Due to an ongoing issue with <a className={ "govuk-link govuk-link--no-visited-state" }*/}
            {/*                                        href={ "https://status.azure.com/en-gb/status" }*/}
            {/*                                        rel={ "noopener noreferrer" }*/}
            {/*                                        target={ "_blank" }>Microsoft Azure</a>,*/}
            {/*        we are currently unable*/}
            {/*        to update the data. We are monitoring the situation closely and will*/}
            {/*        update the website as soon as the services are restored.*/}
            {/*    </p>*/}
            {/*</Announcement> : null}*/}

            {
                timestamp
                    ? <Announcement firstDisplayDate={ parsedTimestamp.start }
                                  lastDisplayDate={ parsedTimestamp.end }>
                        <p className={ "govuk-body" }>
                            <strong>We are updating the data&hellip;</strong>
                        </p>
                        <p className={ "govuk-body" }>The process takes
                            approximately 15 minutes to complete. Please do not refresh the
                            website until { parsedTimestamp.endTimestamp }.
                        </p>
                    </Announcement>
                    : null
            }
        {/*</Suspense>*/}
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
        "/",
        "/testing",
        "/cases",
        "/healthcare",
        "/deaths",
        "/about-data"
    ];


const Navigation = ({ layout, ...props }) => {

    const Nav = layout !== "mobile"
        ? SideNavigation
        : SideNavMobile;
        // ? React.lazy(() => import('components/SideNavigation'))
        // : React.lazy(() => import('components/SideNavMobile'));

    return <Nav { ...props }/>
    // <Suspense fallback={ <Loading/> }>
    //     <Nav { ...props }/>
    // </Suspense>

};  // MobileNavigation


const App = ({ location: { pathname } }) => {

    const
        layout = useResponsiveLayout(768);

    let hasMenu;

    useEffect(() => {

        hasMenu = PathWithSideMenu.indexOf(pathname) > -1;

    }, [ pathname ]);

    return <>
        {/*<CookieBanner/>*/}
        <Header/>
        { layout === "mobile" && <Navigation layout={ layout }/> }
        <div className={ "govuk-width-container" }>
            <LastUpdateTime/>
            <ErrorBoundary>
                <div className={ "dashboard-container" }>
                    {
                        layout === "desktop" &&
                        <aside className={ "dashboard-menu" }>
                            <Switch>
                                <Route path={ "/" }
                                       render={ props =>
                                           <Navigation layout={ layout }{ ...props}/>
                                       }/>
                            </Switch>
                        </aside>
                    }
                    <main className={ "govuk-main-wrapper" } role={ "main" } id={ 'main-content' }>
                        {/*<Suspense fallback={ <Loading/> }>*/}
                            <DashboardHeader/>
                            <Switch>
                                {/*<Route path="/" exact render={ () => window. }/>*/}
                                <Route path="/testing" component={ Testing }/>
                                <Route path="/cases" exact component={ Cases }/>
                                <Route path="/healthcare" component={ Healthcare }/>
                                <Route path="/deaths" component={ Deaths }/>

                                <Route path="/about-data" component={ About }/>
                                {/*<Route path="/archive" component={ Archive }/>*/}
                                <Route path="/accessibility" component={ Accessibility }/>
                                <Route path="/cookies" component={ Cookies }/>
                                <Route path="/developers-guide" exact component={ ApiDocs }/>
                            </Switch>
                        {/*</Suspense>*/}
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
            {/*<Suspense fallback={ <Loading/> }>*/}
                <Route path="/" component={ Footer }/>
            {/*</Suspense>*/}
        </Switch>
    </>
};  // App


export default withRouter(App);
