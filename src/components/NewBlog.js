import React from 'react'

const newBlog = ({onAdd, handleAuthorChange, handleTitleChange, handleUrlChange, blog}) => (
    <div>
        <h4>Add new blog</h4>
        Author: <input name='author' onChange={handleAuthorChange} value={blog.author} />
        Title: <input name='title' onChange={handleTitleChange} value={blog.title} />
        Url: <input name='url' onChange={handleUrlChange} value={blog.url} />
        <button onClick={onAdd}>Add blog</button>
    </div>
)

export default newBlog