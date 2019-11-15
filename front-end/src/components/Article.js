import React, { Component } from "react";
import { connect } from "react-redux";
import { search, newArticle, tags, rate } from "../actions/articleSearch";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import _ from 'lodash';
import './style.css';

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
      tag_count: 0,
      rating: {},
    }
  }
  componentDidMount(){
    this.props.search();
    this.props.tags();
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
  articleSubmit = e => {
    e.preventDefault();
    this.props.newArticle({
      title: this.state.title,
      body: this.state.body,
      tags: this.state.tags,
    }).then(()=>{
      this.handleClose()
    })
  }
  ratingChange = id => e => {
    e.preventDefault()
    let r = this.state.rating
    r[id] = e.target.value
    this.setState({
      rating: r
    });
  }
  ratingSubmit = id => e => {
    e.preventDefault()
    const { rating } = this.state
    this.props.rate({
      article: id,
      rating: rating[id],
    })
    .then(()=> {
      this.handleSubmit(e)
    })
  }
  handleSelect = val => {
    this.setState({
      tags: val.map(v => v.value)
    });
  }
  render() {
  	const { article, tag_count } = this.props
    if(!article) return null
    return (
			<div className="container">

        <div className="button-container" style={{position: 'absolute', top:'171px', left:'45px', zIndex: 100}}>
          <button className="btn btn-primary mb-5" disabled={!this.props.isAuth} onClick={this.handleShow}>New</button>  
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
          <div>
            <table className="table table-striped table-bordered table-dark">
              <thead>
                <tr>
                  <th>Tags</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {tag_count.map((v,i) => (
                  <tr key={i}>
                    <td>{v.key}</td>
                    <td>{v.doc_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="card article">
            <div className="card-header">
                Articles <small>({article.length})</small>
            </div>
            <div className="card-body" style={{background: 'aliceblue'}}>
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
                  <div><h2>{v.title}</h2>{v.created_by && (<span>By {v.created_by}</span>)}</div>
                  <div className="rating-container" style={{paddingBottom: '4px', color: 'green'}}>
                    <div>Avg Rating: {v.avg_rating || '-'}</div>
                    {this.props.isAuth &&
                    <div>Your Rating: {v.curr_rating || 
                      <form onSubmit={this.ratingSubmit(v.id)} className="d-inline-block">
                        <input onChange={this.ratingChange(v.id)} style={{width: '50px', border: 'none'}}/>
                      </form>
                    }</div>}
                  </div>
                  <section className="m-0">{v.body}</section>  
                  <div>
                    {v.tags.map((v,i) => {
                      return (
                        <span key={i} className="badge badge-dark mr-1">{v}</span>
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
  tag_count: state.article.tag_count,
  isAuth: state.auth.isAuthenticated,
});

export default connect(
  mapStateToProps,
  { search, newArticle, tags, rate }
)(Article);
