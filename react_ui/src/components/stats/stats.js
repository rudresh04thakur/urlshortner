import React, { Component } from 'react';
import axios from 'axios';
import './stats.scss';
export default class stats extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      urls :[]
    }
    axios.get("http://localhost:9090/stats").then((res)=>{
        console.log("Response from Server = >",res.data);
        this.setState({urls:res.data});
      }).catch((err)=>{
        console.log("Error in Communication = >",err)
      })
  }

  render() {
    return <div className="component-stats">
      {this.state.urls.map(url => (
         <div className="row bottom">
         <div className="col-md-12">
           <div className="col-md-12">
              <h4><a href={url.longUrl} target="_blank">{url.longUrl}</a></h4>
           </div>
           <div className="col-md-12">
              <h4><a href={url.shortUrl} target="_blank">{url.shortUrl}</a></h4>
           </div>
           <div className="col-md-12">
              <b>{url.clickCount}</b>
           </div>  
           <div className="col-md-12">
              {url.clicks.map(click=>(<div className="col-md-1">{click.countryName}</div>))}
           </div>
         </div>   
         <hr /> 
       </div>
      ))}
     </div>;
  }
}