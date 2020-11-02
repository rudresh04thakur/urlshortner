import React, { Component } from 'react';
import './home.scss'
import axios from 'axios';

export default class home extends Component {
  initForm = {
    longUrl: { value: '', error: '', valid: true },
    isValid: true
  }
  constructor(props) {
    super(props);
    this.state = {
      formValue: this.initForm,
      shortUrl: ''
    };
  }

  submitHandler = (event) => {
    event.preventDefault();
    for (var key in this.state.formValue) {
      if (this.state.formValue[key]['value'] === '' && typeof this.state.formValue[key] === 'object') {
        this.initForm[key]['error'] = " This field is required ";
        this.initForm[key]['valid'] = false;
        this.initForm['isValid'] = false;
      }
    }
    this.setState({ formValue: this.initForm })

    if (this.state.formValue.isValid) {
      axios.post("http://localhost:9090/", { "longUrl": this.state.formValue.longUrl.value }, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
        this.setState({ "shortUrl": res.data.shortUrl });
      }).catch((err) => {
        console.log("Error in Communication = >", err)
      })
    }


  }
  changehandler = (event) => {
    this.initForm[event.target.name]['value'] = event.target.value;
    if (this.initForm[event.target.name]['value'] === '') {
      this.initForm[event.target.name]['error'] = "This field is required "
      this.initForm[event.target.name]['valid'] = false;
      this.initForm['isValid'] = false;
    } else {
      this.initForm[event.target.name]['error'] = "";
      this.initForm[event.target.name]['valid'] = true;
      this.initForm['isValid'] = true;
    }
    this.setState({ formValue: this.initForm })
  }

  render() {
    return <div className="component-home">
      <form onSubmit={this.submitHandler.bind(this)} className="form col-md-6 col-md-offset-3">
        <div className="form-group">
          <label htmlFor="longUrl">URL</label>
          <input className="form-control" type="url" onChange={this.changehandler.bind(this)}
            defaultValue={this.state.formValue['longUrl']['value']}
            placeholder="URL" name="longUrl"></input>
          {(() => {
            if (!this.state.formValue['longUrl']['valid']) {
              return (
                <div className="alert alert-danger">{this.state.formValue['longUrl']['error']}</div>
              )
            }
          })()}
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-success">Generate</button>
        </div>
      </form>
      {(() => {
        if (this.state.shortUrl != '') {
          return (
            <div className="row">
              <div className="col-md-6 col-md-offset-3">
                <span><b>Short URL </b>&nbsp;</span>
                <span><a href={this.state.shortUrl} target="_blank">
                  {this.state.shortUrl}
                </a>
                </span>
              </div>
            </div>
          )
        }
      })()}
    </div>;
  }
}