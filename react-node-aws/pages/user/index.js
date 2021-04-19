import Layout from '../../components/Layout'

export default function Home() {
  return (
    <div id='parent'>
      <div>
        <title>User Page</title>
        <link rel="icon" href="/favicon.ico" />
      </div>  
      <link rel='stylesheet' href="/static/css/styles.module.css" />
      <Layout>
        User Page
      </Layout>    
    </div>
     
  )
}