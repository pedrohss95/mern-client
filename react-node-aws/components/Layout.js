import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import React from 'react';
import { isAuth, logout } from '../helpers/auth'

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

// Router.events.on('routeChangeStart', (url) => NProgress.start());
// Router.events.on('routeChangeComplete', (url) => NProgress.done());
// Router.events.on('routeChangeError', (url) => NProgress.done());

const Layout = ({ children }) => {
  const head = () => (
    <Head>
      <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css"
        integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl"
        crossOrigin="anonymous"
      />
      {/*<link rel='stylesheet' href="/styles/Home.module.css" />*/}
    </Head>
  );
  const nav = () => (
    <ul className="nav nav-tabs bg-dark d-flex">
      <li className="nav-item">
        <Link href="/">
          <a className="nav-link text-light">
            Home
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href="/user/link/createLink">
          <a className="nav-link text-light">
            Submit a link
          </a>
        </Link>
      </li>
      {!isAuth() && (
        <React.Fragment>
          <li className="nav-item">
            <Link href="/login">
              <a className="nav-link text-light">
                Login
              </a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/register">
              <a className="nav-link text-light">
                Register
              </a>
            </Link>
          </li>
        </React.Fragment>
      )}

      {isAuth() && isAuth().role === 'admin' && (
        <li className="nav-item ms-auto">
          <Link href="/admin">
            <a className="nav-link text-light">
              {isAuth().name}
            </a>
          </Link>
        </li>
      )}

      {isAuth() && isAuth().role === 'subscriber' && (
        <li className="nav-item ms-auto">
          <Link href="/user">
            <a className="nav-link text-light">
              {isAuth().name}
            </a>
          </Link>
        </li>
      )}

      {isAuth() && (
        <li className="nav-item">
          <a onClick={logout} className="nav-link text-light">
            Logout
          </a>
        </li>
      )}
    </ul>
  )
  return (
    <React.Fragment>
      {head()}
      {nav()}
      <div className='container pt-5 pb-5'>
        {children}
      </div>
    </React.Fragment>
  )
};

export default Layout;