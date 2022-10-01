import { useState, useEffect } from 'react';
import './App.css';

const App = () => {

  const [inputData, setInputData] = useState('');
  const [todos, setTodos] = useState([]);
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [isEditItem, setIsEditItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, [])

  // get data
  const fetchData = async () => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        setTodos(json.slice(0, 15))
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // add items fake post call
  const addTask = async () => {
    // if (inputData !== undefined && inputData !== '') {
    if (!inputData) {
      window.alert('Title field can not be empty!');
    } else if (inputData && !toggleSubmit) {
      fetch('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'PUT',
        body: JSON.stringify({
          title: inputData,
          userId: 1,
          completed: false
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json));

      // console.log('inside ELSE IF');
      setTodos(
        todos.map((elem) => {
          if (elem.id === isEditItem) {
            return { ...elem, title: inputData }
          }
          return elem;
        })
      )
      setToggleSubmit(true);
      setInputData('');
      setIsEditItem(null);
    }
    else {
      console.log('inside else');
      // window.alert('Title field can not be empty!');
      await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify({
          userId: 1,
          title: inputData,
          completed: false,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => [json, ...todos])
        .then((data) => setTodos(data));
      setInputData('');
    }
  }

  //update data
  // const updateTask = async (id) => {
  //   console.log()
  //   fetch('https://jsonplaceholder.typicode.com/todos', {
  //     method: 'PUT',
  //     body: JSON.stringify({
  //       title: 'abc'
  //     }),
  //     headers: {
  //       'Content-type': 'application/json; charset=UTF-8',
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((json) => console.log(json))
  //   // .then((json) => {setTodos((todos) => [...todos, json])})
  //   // .catch((err) => {
  //   //   console.log(err);
  //   // })
  // }

  const editTask = (id) => {
    let newEditItem = todos.find((elem) => {
      return elem.id === id
    })
    setToggleSubmit(false);
    setInputData(newEditItem.title);
    setIsEditItem(id);
  }

  const deleteTask = async (id) => {
    console.log('deleteTask :', id);
    await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setTodos(todos.filter((todo) => {
          return todo.id !== id;
        }))
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-6">
          <h1 className="text-center mt-4 mb-3 pb-3 border-bottom">Todo App</h1>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-6">
          <div className="row mb-3">
            <div className="col-9">
              <div className="input-group">
                <input type="text" className="form-control" name="addTodo" placeholder="Add your Todo.." aria-label="add todo" aria-describedby="basic-addon2"
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                />
              </div>
            </div>
            <div className="col-3 text-center">
              {
                toggleSubmit ? <button type="button" className="btn btn-outline-primary" onClick={addTask}>Add Task</button> : <button type="button" className="btn btn-outline-primary" onClick={addTask}>Update Task</button>
              }
            </div>
          </div>

          <ul className="list-group">
            {
              todos.map((todo) => {
                return (
                  <li className={`list-group-item ${todo.completed ? 'completed' : ''}`} key={todo.id}>
                    {`${todo.id}. ${todo.title}`}
                    <span className="action-button">
                      <button type="button" className="btn btn-light" onClick={() => editTask(todo.id)}>Edit</button>
                      <button type="button" className="btn btn-light" onClick={() => deleteTask(todo.id)}>Delete</button>
                    </span>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    </div>

  );
}

export default App;
