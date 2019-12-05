import React, { Component } from "react";
import { connect } from "react-redux";
import { search, newArticle, tags, newRating, updateRating } from "../actions/articleSearch";
import { Button, Modal, Dropdown, DropdownButton} from "react-bootstrap";
import Select from "react-select";
import InputRange from 'react-input-range';
import Pusher from 'pusher-js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-input-range/lib/css/index.css';
import _ from 'lodash';
import './style.css';

const APP_KEY = '6ed67f107e6261ea840f'
const APP_CLUSTER = 'ap2'
Pusher.logToConsole = true

toast.configure()

const options = [
  { value: 'php', label: 'php' },
  { value: 'java', label: 'java' },
  { value: 'ruby', label: 'ruby' },
  { value: 'bash', label: 'bash' },
  { value: 'javascript', label: 'javascript' },
]

const dataOptions = {
  sort: [ 'score', 'title', 'avg_rating', 'my_rating'],
  order: [ 'asc', 'desc'],
}

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
      activeSort: 0,
      activeOrder: 1,
      filter: { min: 0, max: 10 },
      p: false,
    }
    props.search()
    props.tags()
  }
  componentDidMount(){
    const socket = new Pusher(APP_KEY, {
      cluster: APP_CLUSTER,
      authEndpoint: 'http://localhost:8000/broadcasting/auth',
      forceTLS: true,
    });
    const channel = socket.subscribe('article');
    channel.bind('App\\Events\\NewArticleEvent', data => {
      this.handleSubmit()
      this.props.tags()
      toast('New Article added => ' + data.article.title)
    })
  }
  handleChange = e => {
    this.setState({[e.target.name]: e.target.value})
  }
  handleSubmit = e => {
    if(e) e.preventDefault();
    this.props.search({
      searchQuery: this.state.q,
      sort: dataOptions.sort[this.state.activeSort],
      order: dataOptions.order[this.state.activeOrder],
      min: this.state.filter.min,
      max: this.state.filter.max,
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
  ratingSubmit = v => e => {
    e.preventDefault()
    const { rating } = this.state
    let id = v.id
    v.edit = false
    if(v.curr_rating)
      this.props.updateRating({
        article: id,
        rating: rating[id],
      })
      .then(()=> {
        this.handleSubmit()
      })
    else this.props.newRating({
      article: id,
      rating: rating[id],
    })
    .then(()=> {
      this.handleSubmit()
    })
  }
  handleSelect = val => {
    this.setState({
      tags: val.map(v => v.value)
    });
  }
  selectSort = v => {
    this.setState({activeSort: parseInt(v)}, ()=> this.handleSubmit())
  }
  selectOrder = v => {
    this.setState({activeOrder: parseInt(v)}, ()=> this.handleSubmit())
  }
  render() {
  	const { article, tag_count } = this.props
    const { activeSort, activeOrder } = this.state
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
                    <td>{v.tag || v.key}</td>
                    <td>{v.doc_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="card article">
            <div className="card-header position-relative">
                Articles <small>({article.length})</small>
                <div className="sort-filter-container">
                  <div className="filter px-3">
                    <DropdownButton title='Filter' variant="primary" size="sm" disabled={!this.props.isAuth}>
                      <div className="mx-3 mb-3">
                        <div className="pb-4" style={{fontSize: '15px', textAlign: 'center'}}>My Rating Range</div>
                        <InputRange
                          maxValue={10}
                          minValue={0}
                          step={0.1}
                          formatLabel={v => v.toFixed(1)}
                          value={this.state.filter}
                          onChange={v => this.setState({ filter: v })}
                        />
                      </div>
                    </DropdownButton>
                  </div>
                  <div className="sort px-3">
                    <div className="px-2">
                      <DropdownButton title='Sort' variant="primary" size="sm">
                        {dataOptions.sort.map((v,i)=><Dropdown.Item active={i===activeSort} disabled={!this.props.isAuth && i===3} onSelect={this.selectSort} eventKey={i} key={i}>{v}</Dropdown.Item>)}
                      </DropdownButton>
                    </div>
                    <div className="px-2">
                      <DropdownButton title='Order' variant="secondary" size="sm">
                        {dataOptions.order.map((v,i)=><Dropdown.Item active={i===activeOrder} onSelect={this.selectOrder} eventKey={i} key={i}>{v}</Dropdown.Item>)}
                      </DropdownButton>
                    </div>
                  </div>
                </div>
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
                  <div>
                    <h2>{v.title}</h2>
                    {v.created_by && (<span>By {v.created_by}</span>)
                  }</div>
                  <div className="rating-container" style={{paddingBottom: '4px', color: 'green'}}>
                    <div>Avg Rating: {v.avg_rating || '-'}</div>
                    {this.props.isAuth &&
                    <div>Your Rating: {v.curr_rating && !v.edit ?
                      <span>
                        {v.curr_rating}
                        <button className="btn btn-info btn-sm p-1 ml-3" 
                          onClick={()=>{
                            v.edit = true
                            this.setState({p: !this.state.p})
                          }}>Edit
                        </button>
                      </span>
                      :
                      <span>
                        <form onSubmit={this.ratingSubmit(v)} className="d-inline-block">
                          <input placeholder={v.curr_rating} onChange={this.ratingChange(v.id)} style={{width: '50px', border: 'none'}}/>
                        </form>
                        {v.curr_rating && 
                        <button className="btn btn-warning btn-sm p-1 ml-3" 
                          onClick={()=>{
                            v.edit = false
                            this.setState({p: !this.state.p})
                          }}>Cancel
                        </button>
                        }
                      </span>
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
  { search, newArticle, tags, newRating, updateRating }
)(Article);
