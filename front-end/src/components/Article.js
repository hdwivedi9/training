import React, { Component } from "react";
import { connect } from "react-redux";
import { search } from "../actions/articleSearch";
import _ from 'lodash';

class Article extends Component {
  constructor (props){
    super(props);
    this.state= {
      q: ''
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
  render() {
  	const { article } = this.props
    if(!article) return null
    return (
			<div className="container">
        <div className="card">
            <div className="card-header">
                Articles <small>({article.length})</small>
            </div>
            <div className="card-body">
              <form onSubmit={this.handleSubmit}>
                  <div class="form-group row">
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
            	article.map(v => {
                return (
                  <article className="mb-3">
                  <h2>{v.title}</h2>
                  <body className="m-0">{v.body}</body>
                  <div>
                    {v.tags.map(v => {
                      return (
                        <span class="badge badge-light">{v}</span>
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
  { search }
)(Article);
