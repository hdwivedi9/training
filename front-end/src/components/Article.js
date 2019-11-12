import React, { Component } from "react";
import { connect } from "react-redux";
import { search, newArticle } from "../actions/articleSearch";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import _ from 'lodash';

const options = [
  {value: 'php', label: 'php'},
  {value: 'java', label: 'java'},
  {value: 'ruby', label: 'ruby'},
  {value: 'bash', label: 'bash'},
  {value: 'javascript', label: 'javascript'},
]

class Article extends Component {
  constructor (props){
    super(props);
    this.state= {
      q: '',
      show: false,
      title: '',
      body: '',
      tags: [],
    }
  }
  componentDidMount(){
    this.props.search();
  }
  handleChange = e => {
    this.setState({[e.target.name]: e.target.value})
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.search({
      searchQuery: this.state.q
    })
  }
  handleClose = () => {
    this.setState({show: false, title: '', body: '', tags: []});
  }
  handleShow = () => {
    this.setState({show: true});
  }
  articleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  articleSubmit = (e) => {
    e.preventDefault();
    this.props.newArticle({
      title: this.state.title,
      body: this.state.body,
      tags: this.state.tags,
    }).then(()=>{
      this.handleClose()
    })
  }
  handleSelect = val => {
    this.setState({
      tags: val.map(v => v.value)
    });
  }
  render() {
  	const { article } = this.props
    if(!article) return null
    return (
			<div className="container">
        <button className="btn btn-primary" onClick={this.handleShow}
         style={{position: 'absolute', top:'193px', left:'60px', zIndex: 100}}>New</button>
         <Modal show={this.state.show} onHide={this.handleClose} size="lg">
          <Modal.Dialog style={{width: '500px'}}>
            <Modal.Header>
              <Modal.Title style={{width:'100%'}}>
              <input name="title" type="text" placeholder="Enter Article Title" style={{width:'100%'}} onChange={this.articleChange}/>
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              ​<textarea name="body" rows="10" cols="55" placeholder="Enter Article Body" onChange={this.articleChange}/>
              <Select isMulti name="tags" options={options} placeholder="Tags" onChange={this.handleSelect}
              className="basic-multi-select" classNamePrefix="select"/>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose} >Cancel</Button>
              <Button variant="primary" onClick={this.articleSubmit}>Save changes</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal>
        
        <div className="card">
            <div className="card-header">
                Articles <small>({article.length})</small>
            </div>
            <div className="card-body">
              <form onSubmit={this.handleSubmit}>
                  <div className="form-group row">
                    <input
                      type="text"
                      name="q"
                      className="form-control col mr-2"
                      placeholder="Search..."
                      onChange={this.handleChange}
                      value={this.state.q}
                    />
                    <button className="btn btn-primary ml-auto">Search</button>
                  </div>
                </form>
              {_.isEmpty(article) ? <p>No articles found</p> :
            	article.map((v,i) => {
                return (
                  <article key={i} className="mb-3">
                  <h2>{v.title}</h2>
                    <section className="m-0">{v.body}</section>  
                  <div>
                    {v.tags.map((v,i) => {
                      return (
                        <span key={i} className="badge badge-light">{v}</span>
                      )
                    })}
                  </div>
                  </article>
                )
              })}
            </div>
        </div>
    </div>
    )
  }
}

const mapStateToProps = state => ({
  article: state.article.result,
});

export default connect(
  mapStateToProps,
  { search, newArticle }
)(Article);
