import React from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import NewBlog from './components/NewBlog'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      username: '',
      password: '',
      user: null,
      title: '',
      author: '',
      url: ''
    }
  }

  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )
    const loggedUserJSON = window.localStorage.getItem('loggedBlogger')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({user})
      blogService.setToken(user.token)
    }
  }

  addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      author: this.state.author,
      title: this.state.title,
      url: this.state.url
    }
    this.NewBlog.toggleVisibility()
    blogService
      .create(blogObject)
      .then(newBlog => {
        this.setState({
          blogs: this.state.blogs.concat(newBlog),
          author: '',
          title: '',
          url: ''
        })
      })
  }

  handleLoginFieldChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  handleUsernameChange = (event) => {
    this.setState({username: event.target.value})
  }

  handlePasswordChange = (event) => {
    this.setState({password: event.target.value})
  }

  handleAuthorChange = (event) => {
    this.setState({author: event.target.value})
  }

  handleTitleChange = (event) => {
    this.setState({title: event.target.value})
  }

  handleUrlChange = (event) => {
    this.setState({url: event.target.value})
  }

  login = async (event) => {
    event.preventDefault()
  
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })
      
      window.localStorage.setItem('loggedBlogger', JSON.stringify(user))
      blogService.setToken(user.token)
      this.setState({ username: '', password: '', user})
    } catch(exception) {
      this.setState({
        error: 'käyttäjätunnus tai salasana virheellinen'
      })
      setTimeout(() => {
        this.setState({error: null})
      }, 5000)
    }
  }

  render() {

    const loginForm = () => (
      <div>
        <LoginForm
          username={this.state.username}
          password={this.state.password}
          handleChange={this.handleLoginFieldChange}
          handleSubmit={this.login}
        />
      </div>
    )

    const blogList = () => (
      <div>
        <BlogList blogs={this.state.blogs}/>
        <Togglable buttonLabel='Add new blog' ref={component => this.NewBlog = component}>
          <NewBlog 
            handleAuthorChange={this.handleAuthorChange}
            handleTitleChange={this.handleTitleChange}
            handleUrlChange={this.handleUrlChange}
            onAdd={this.addBlog}
            blog={{
              author: this.state.author,
              title: this.state.title,
              url: this.state.url
            }}
          />
        </Togglable>  
      </div>
    )
    
    return (
      <div>
          {this.state.user === null ?
            loginForm() :
            <div>
              <p>{this.state.user.name} logged in 
                <button 
                  onClick={() => window.localStorage.removeItem('loggedBlogger')}>Kirjaudu ulos
                </button>
              </p>
            {blogList()}
          </div>
        }

      </div>
    );
  }
}

export default App;
