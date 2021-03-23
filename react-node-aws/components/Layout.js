import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Router.events.on('routeChangeStart', (url) => NProgress.start());
Router.events.on('routeChangeComplete', (url) => NProgress.done());
Router.events.on('routeChangeError', (url) => NProgress.done());

export default function Layout ({children}) {
    return (
       <React-Fragment>
           <Head>
                <link rel='stylesheet' href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossOrigin="anonymous"/>
                <link rel='stylesheet' href="/static/css/styles.module.css" />
            </Head>
            <ul className="nav nav-tabs bg-dark">
                <li className="nav-item">
                    <Link href="/">
                        <a className="nav-link text-light">
                            Home
                        </a>
                    </Link>
                </li>
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
            </ul>  
            <div className='container pt-5 pb-5'>
                {children}
            </div>
        </React-Fragment>       
    )
}