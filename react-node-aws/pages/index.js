//import cssLoaderConfig from '@zeit/next-css/css-loader-config'
// import Head from 'next/head'
//import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import styles from '../public/static/css/styles.module.css'

export default function Home() {
  return (
    <div id='parent'>
      <div>
        <title>Pedro app</title>
        <link rel="icon" href="/favicon.ico" />
      </div>  
      <link rel='stylesheet' href="/static/css/styles.module.css" />
      <Layout>
        Home
        <div>
          <main className='main'>  
          Welcome to my app!
          </main>
        </div>
      </Layout>    
    </div>
     
  )
}
