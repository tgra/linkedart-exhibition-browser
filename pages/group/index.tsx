import type { Event } from '../../interfaces'
import useSwr from 'swr'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router';
import Pagination from 'react-bootstrap/Pagination';

import Table from 'react-bootstrap/Table';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

// Import the FontAwesomeIcon component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import the icons you need
import {

  faSortAlphaUp ,
  faSortAlphaDown
} from "@fortawesome/free-solid-svg-icons";


const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Gropu_index(req: NextApiRequest) {
  const { isReady, query }: string | any = useRouter();
  let page = 1;
  let pp = process.env.NEXT_PUBLIC_RECORDS_PER_PAGE;
  
  
  let sort = "asc";
  let orderby = "label";
  
  
  if (query.page){ page = query.page;}
  if (query.pp){ pp = query.pp;}

  if (query.sort){ sort = query.sort;}
  if (query.orderby){ orderby = query.orderby;}
  let pagination = Paging(page,pp, sort, orderby)

 

  const { data, error } = useSwr<Event[]>('/api/groups_all' , fetcher)

  //console.log(data)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false,
    configurable: true
  });

  return (
    <div>
    
        
      <Head>
        <title> Alternative New York Exhibitions - Groups</title>
        <script src="https://unpkg.com/react/umd/react.production.min.js" crossOrigin></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
    integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor"
    crossOrigin="anonymous" />
      
      </Head>

  
      <main>
<Breadcrumb>
      <Breadcrumb.Item href="/">{process.env.NEXT_PUBLIC_APP_BREADCRUMB_HOME}</Breadcrumb.Item>
      <Breadcrumb.Item active href="/exhibition">{process.env.NEXT_PUBLIC_GROUP_BREADCRUMB_PLURAL}</Breadcrumb.Item>
    
</Breadcrumb> 
     
<div class="container">
<div class="row">
<div class="col col-lg-3 facet-menu">
        <h1 className="title">{process.env.NEXT_PUBLIC_GROUP_TITLE}</h1>

        <p className="description">{process.env.NEXT_PUBLIC_GROUP_DESCRIPTION}</p>
        
</div>

<div class="col">
{pagination}
        
       

        <Table  striped borderless hover size="sm">
      <thead>
        <tr>    
          <th>Title</th>
</tr>  


        <tr>
        {JSON.parse(process.env.NEXT_PUBLIC_GROUP_LIST_COLUMNS).columns.map((obj) => <th>{obj.label.capitalize()}</th>)}
 
        </tr>
        <tr>
        {JSON.parse(process.env.NEXT_PUBLIC_GROUP_LIST_COLUMNS).columns.map((obj) => <td><Link href={"?orderby=" + obj.label + "&sort=asc"}><FontAwesomeIcon icon={faSortAlphaDown} /></Link>&nbsp;&nbsp;<Link href={"?orderby=" + obj.label + "&sort=desc"}><FontAwesomeIcon icon={faSortAlphaUp} /></Link></td>)}
 
        </tr>
       
     
      </thead>
      <tbody>
      {
      data.result.map((obj) => (
        <tr key={obj.id}>
          <td><Link href={obj.id.toLowerCase().replace(process.env.NEXT_PUBLIC_BASE_URI,'')} >{obj.label}</Link></td>
        </tr>
      ))}
      </tbody>
      </Table>
        

      </div>
</div>
</div>

      </main>
    </div>


    
  )
}




function Paging(page,pp) {
 
  page = parseInt(page);
  pp = parseInt(pp);
  let first_url = "?page=1&pp="+ pp;

  let prev_url = "?page=" + (page - 1) + "&pp="+ pp;
  let next_url = "?page=" + (page + 1) + "&pp="+ pp;
  let last_url = "?page=last&pp="+ pp;
  let items = [<Pagination.First href={first_url}/>,<Pagination.Prev href={prev_url}/>];

  const s = page;
  const e = parseInt(s) + 9;
  for (let number = s; number <= e; number++) {

    let url = "?page=" + (number) + "&pp="+ pp;

    items.push(
      <Pagination.Item key={number} href={url} active={number == page}>
        {number}
      </Pagination.Item>,
    );
    
  }
  items.push(<Pagination.Next href={next_url}/>,<Pagination.Last href={last_url}/>)
  
  const pagination = (
    <div>
      <Pagination>{items}</Pagination>
    </div>
  );
  
  return pagination;

}
