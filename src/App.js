import { useState } from 'react';
import './App.css';
function Header(props) {
  return (
    <header>
      <h1><a href="/" onClick={ e => {
        e.preventDefault();
        props.onChangeMode();
      }}>{ props.title }</a></h1>
    </header>
  );
}
function Nav(props) {
  let t = props.topics;
  const list = [];
  for (let i = 0; i < t.length; i++) {
    list.push(<li key={t[i].id}><a id={t[i].id} href={"/read/"+t[i].id} onClick={e => {
      e.preventDefault();
      props.onChangeMode(e.target.id);
    }}>{t[i].title}</a></li>);
  }
  return (
    <nav>
      <ol>
        {list}
      </ol>
    </nav>
  );
}
function Article(props) {
  return (
    <article>
      <h2>{ props.title }</h2>
      { props.body }
      {/* <input type="button" value="update" onClick={e => {
        e.preventDefault();
        props.onChangeMode();
      }} /> */}
    </article>
  );
}
function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={e => {
      e.preventDefault();
      const title = e.target.title.value;
      const body = e.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" /></p>
      <p><textarea name="body" placeholder="body"></textarea></p>
      <p><input type="submit" value="Create" /></p>
    </form>
  </article>
}
function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={e => {
      e.preventDefault();
      const title = e.target.title.value;
      const body = e.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={e => {
        setTitle(e.target.value);
      }} /></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={e => setBody(e.target.value)}></textarea></p>
      <p><input type="submit" value="Update" /></p>
    </form>
  </article>
}
function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    { id: 1, title: 'html', body: 'html is ...'},
    { id: 2, title: 'css', body: 'css is ...'},
    { id: 3, title: 'js', body: 'js is ...'},
  ]);
  let content = null;
  let contextControl = null;
  if (mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, Web" />;
  } else if (mode === 'READ') {
    let title, body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === Number(id)) {
        title = topics[i].title;
        body = topics[i].body;
        break;
      }
    }
    content = <Article title={ title } body={ body } />;
    contextControl = <>
      <li><a href={"/update/" + id} onClick={ e => {
        e.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
      <li><input type="button" value="Delete" onClick={() => {
        const newTopics = [];
        for (let i=0; i<topics.length; i++) {
          if (topics[i].id !== Number(id)) {
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');
      }} /></li>
    </>
  }
  else if (mode === 'CREATE') {
    content = <Create onCreate={(title, body) => {
      const newTopic = { id: nextId, title: title, body: body };
      setTopics([...topics, newTopic]);
      setId(nextId);
      setMode('READ');
      setNextId(nextId + 1);
    }} />;
  }
  else if (mode === 'UPDATE') {
    let title, body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === Number(id)) {
        title = topics[i].title;
        body = topics[i].body;
        break;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body) => {
      const updatedTopic = { id: Number(id), title: title, body: body };
      const newTopics = [...topics]
      for(let i = 0; i < newTopics.length; i++) {
        if (newTopics[i].id === Number(id)) {
          newTopics[i] = updatedTopic;
          break;
        }
      }
      console.log(newTopics);
      setTopics(newTopics);
      setMode('READ');
    }} />;
  }
  return (
    <div>
      <Header title="REACT" onChangeMode={() => {
        setMode('WELCOME');
      }} />
      <Nav topics={topics}  onChangeMode={(_id) => {
        setMode('READ');
        setId(_id);
      }} />
      { content }
      <ul>
        <li><a href="/create" onClick={e => {
        e.preventDefault();
        setMode('CREATE');
      }}>Create</a></li>
      { contextControl }
      </ul>
    </div>
  );
}

export default App;
