import Layout from '../../components/Layout'

export default function Home() {
  return (
    <div id='parent'>
      <div>
        <title>Admin Page</title>
        <link rel="icon" href="/favicon.ico" />
      </div>  
      <link rel='stylesheet' href="/static/css/styles.module.css" />
      <Layout>
        Admin Page
      </Layout>    
    </div>
     
  )
}