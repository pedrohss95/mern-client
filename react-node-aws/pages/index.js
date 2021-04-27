//import cssLoaderConfig from '@zeit/next-css/css-loader-config'
// import Head from 'next/head'
//import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
//import styles from '../public/static/css/styles.module.css'

export default function Home() {
  return (
    <div id='parent'>
      <div>
        <title>Pedro app</title>
        <link rel="icon" href="/favicon.ico" />
      </div>  
      <link rel='stylesheet' href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossOrigin="anonymous"/>
        <Layout>
        {/* <div className="col-md-6 offset-md-3">   */}
            Home
            <main className='main'>  
            Welcome to my app!
            </main>
        {/* </div> */}
        </Layout>    
    </div>
     
  )
}
