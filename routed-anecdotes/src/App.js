import { useState } from 'react'
import { useField } from './hooks'

import {
  Routes, Route, Link,
  useNavigate, useMatch
} from 'react-router-dom'

const Menu = (props) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
        <Link style={padding} to='/anecdotes'>anecdotes</Link>
        <Link style={padding} to='/create'>create new</Link>
        <Link style={padding} to='/about'>about</Link>
      <Routes>
        <Route path='/anecdotes' element={<AnecdoteList anecdotes={props.anecdotes} />} />
        <Route path='/anecdotes/:id' element={<Anecdote anecdote={props.anecdote} />} />
        <Route path='/create' element={<CreateNew addNew={props.addNew} setNotification={props.setNotification} />} />
        <Route path='/about' element={<About />} />
        <Route path='/' element={<AnecdoteList anecdotes={props.anecdotes} />} />
      </Routes>
    </div>
  )
}

const Anecdote = ({ anecdote }) => {
  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
        <li key={anecdote.id} >
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      )}
    </ul>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    const contentToSubmit = content.value
    const authorToSubmit = author.value
    const infoToSubmit = info.value

    e.preventDefault()
    props.addNew({
      content: contentToSubmit,
      author: authorToSubmit,
      info: infoToSubmit,
      votes: 0
    })
    navigate('/anecdotes')
    props.setNotification(`a new anecdote ${contentToSubmit} created!`)
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button>create</button>
      </form>
    </div>
  )

}

const App = () => {
  const match = useMatch('/anecdotes/:id')

  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const anecdote = match
  ? anecdotes.find(a => a.id === Number(match.params.id))
  : null

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  const showNotification = () => {
    if (notification) {
      setTimeout(() => {
        setNotification('')
      }, 5000)
      return (
        <div>
          {notification}
        </div>
      )
    }
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      {showNotification()}
      <Menu 
        anecdotes={anecdotes} 
        addNew={addNew}
        setNotification={setNotification}
        anecdote={anecdote}
      />
      <Footer />
    </div>
  )
}

export default App
