import Link from 'next/link';
import Head from 'next/head';

import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Table from 'react-bootstrap/Table';

export default function Exhibition({ data }) {
  

  if (!data) return <div>No data...</div>
  
  let carried_out_by = (("carried_out_by" in data) && (("_label" in data.carried_out_by[0]) || ("id" in data.carried_out_by[0])) )  ? true : false;
   
  let influenced_by = (("influenced_by" in data) && (("_label" in data.influenced_by[0]) || ("id" in data.influenced_by[0])) )  ? true : false;
  
  return (
    <div>
    
      <Head>
        <title> Alternative New York Exhibition</title>
        <script src="https://unpkg.com/react/umd/react.production.min.js" crossOrigin></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
    integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor"
    crossOrigin="anonymous" />
      
      
      </Head>
      
      
<main>
<Breadcrumb>
      <Breadcrumb.Item href="/">{process.env.NEXT_PUBLIC_APP_BREADCRUMB_HOME}</Breadcrumb.Item>
      <Breadcrumb.Item href="/exhibition">{process.env.NEXT_PUBLIC_ACTIVITY_BREADCRUMB_PLURAL}</Breadcrumb.Item>
      <Breadcrumb.Item active href="#">{process.env.NEXT_PUBLIC_ACTIVITY_BREADCRUMB_SINGULAR}</Breadcrumb.Item>
</Breadcrumb> 

 
       
<h1>{process.env.NEXT_PUBLIC_ACTIVITY_BREADCRUMB_SINGULAR}: {data._label}</h1>
<Table>
     
        {("took_place_at" in data) ? <tr><th>Location</th><td>{data.took_place_at._label}</td></tr> : ""}

        {"timespan" in data && "begin_of_the_begin" in data.timespan ? <tr><th>Start Date</th><td>{new Date(data.timespan.begin_of_the_begin).toISOString().split('T')[0]}</td></tr> : ""}
        {"timespan" in data && "end_of_the_end" in data.timespan ? <tr><th>End Date</th><td>{new Date(data.timespan.end_of_the_end).toISOString().split('T')[0]}</td></tr> : ""}

        { carried_out_by == true  ? <tr><th>{process.env.NEXT_PUBLIC_CARRIED_OUT_BY}</th><td><ol>{data.carried_out_by.map((obj) => (<li key={obj.id.toLowerCase().replace(process.env.NEXT_PUBLIC_BASE_URI, "")}><Link href={obj.id.toLowerCase().replace(process.env.NEXT_PUBLIC_BASE_URI, "")}>{"_label" in obj ? obj._label : obj.id}</Link></li>))}</ol></td></tr> : ""}
        { influenced_by == true  ? <tr><th>{process.env.NEXT_PUBLIC_INFLUENCED_BY}</th><td><ol>{data.influenced_by.map((obj) => (<li key={obj.id.toLowerCase().replace(process.env.NEXT_PUBLIC_BASE_URI, "")}><Link href={obj.id.toLowerCase().replace(process.env.NEXT_PUBLIC_BASE_URI, "")}>{"_label" in obj ? obj._label : obj.id}</Link></li>))}</ol></td></tr> : ""}
  
        {("part" in data) ?
            <tr><th>People Associated With Exhibition</th><td></td></tr>
            : ""}
          {
            ("part" in data) ?
              data.part.involved.map((set) => (

                <tr>
                  <td><b>Role</b> {set._label}</td>
                  <td>
                    <ol>
                      {
                        set.about.map((agent) => (
                          <li key={'/person/' + agent.id.split("/").pop()}><Link href={'/person/' + agent.id.split("/").pop()}>{agent._label}</Link></li>
                        ))
                      }
                    </ol>
                  </td>
                </tr>
              ))
              : ""}






       
  

</Table>






        
       
</main>
</div>

  )
}





export async function getStaticPaths() {

  const res = await fetch('http://localhost:3000/api/events_all')
  const data = await res.json()

 
  const ids = data.result.map((event) => (
    {params:{id:event.id},}))
  return {
    paths: [...ids],
    fallback: false, // can also be true or 'blocking'
  }
}


export async function getStaticProps({ params }) {
  
  const res = await fetch('http://localhost:3000/api/event/' + params.id )
  const data = await res.json()

  
  return {
    props: {
      data,
    },
  }
}



