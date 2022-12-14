import type { NextApiRequest, NextApiResponse } from 'next'

import { exit } from 'process';


var fs = require('fs');



export default function handler(req: NextApiRequest, res: NextApiResponse) {
    

  
    let dir = process.env.ACTIVITY_DATA_PATH;
    let events = [];
    
    

    fs.readdir(dir, function (err, files) { 
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
          }

          let meta = {
            success: true,
            totalCount: 0,
           
          
          }
          // total number of files in dir
          meta.totalCount = files.length;
         


          files.forEach(function (file) {

              let filepath = dir + '/' + file;
              let rawdata = fs.readFileSync(filepath);
              let event = JSON.parse(rawdata);
            
             let label = ("_label" in event) ? event._label : "identified_by" in event && event.identified_by[0].type == 'Name' ? event.identified_by[0].content : "";
              let filename = file;
              let id = file.split('.')[0];
              let start = event.timespan.begin_of_the_begin
              let end = event.timespan.end_of_the_end
              let venue = "" ; //event.took_place_at[0]._label
              let org = event.carried_out_by[0]._label

              events.push({id:id,filename:filename,label:label, start:start, end:end, location:venue, org:org});
  
      });

     

        let all_events = { meta: meta, result: events };
        res.status(200).json(all_events);
        exit 
     
            
          
    
       
    });
    
   


}



