import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

const TaskList = ({ tasks, taskContract, loadTasks }) => {

  const createTask = async (event) => {

    event.preventDefault();
    if (!taskContract) {
      console.log('taskContract not loaded', taskContract);
      return;
    }
     

    const content = event.target.elements.newTask.value;

    console.log('content: ', content);
    console.log('taskContract: ', taskContract);
    try {
      console.log('taskContract.methods: ', taskContract.methods);
      await taskContract.methods.createTask(content).send({ from: window.ethereum.selectedAddress });
      await loadTasks(taskContract);
    } catch (error) {
      console.log('Error, createTask: ', error);
    }
  };

  const toggleCompleted = async (event) => {
    try {
      const taskId = event.target.name;
      console.log('taskId: ', taskId);
      await taskContract.methods.toggleCompleted(taskId).send({ from: window.ethereum.selectedAddress });
      await loadTasks(taskContract);
    }
    catch (error) {
      console.log('Error, toggleCompleted: ', error);
    }  
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <main role="main" className="col-lg-12 d-flex justify-content-center">
          {/* <div id="loader" className="text-center">
            <p className="text-center">Loading...</p>
          </div> */}
          <div id="content">
            <form onSubmit={createTask}>
              <input id="newTask" type="text" className="form-control" placeholder="Add task..." required />
              <input type="submit" hidden />
            </form>
            <ul id="taskList" className="list-unstyled">
              {tasks.map((task, index) => (
                task.content && !task.completed &&
                (<div key={index} className="taskTemplate checkbox" >
                  <label onClick={toggleCompleted}>
                    <input type="checkbox" name={task.id} />
                    <span className="content">{task.content}</span>
                    </label>
                </div>)
              ))}
            </ul>
            <ul id="completedTaskList" className="list-unstyled">
            {tasks.map((task, index) => (
                task.content && task.completed &&
                (<div key={index} className="taskTemplate checkbox" >
                  <label onClick={toggleCompleted}>
                    <input type="checkbox" name={task.id} />
                    <span className="content">{task.content}</span>
                    </label>
                </div>)
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskList;
