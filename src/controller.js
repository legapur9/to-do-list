// application logic
import { Elements } from './elements';
import { renderer } from './render';
import { createProject } from './project';
import { createTodo } from './todo';

const controller = (function () {
   let elements = new Elements;
   let todayProject = createProject("Today");
   let weekProject = createProject("Next 7 Days");
   let projects = [todayProject, weekProject];
   
   const getProject = (projectTitle) => { 
      return projects.find(project => project.title === projectTitle) 
   }

   const getTodo = (project, todoTitle) => {
      return project.toDos.find(todo => todo.title === todoTitle);
   }

   const getSelectedProject = () => {
      let selectedProjectDiv = elements.getSelectedProject();
      let projectTitle = selectedProjectDiv.children[1].innerHTML;
      return getProject(projectTitle);
   }
   
   const selectProject = (project) => {
      renderer.clearTodos();
      renderer.selectProject(project);
      renderer.updateTodoHeading(project.title);
      project.toDos.forEach(todo => {
         addTodoDiv(todo);
      });
   }

   const projectClickEvent = (event) => {
      let projectDiv = event.currentTarget;
      let projectTitle = projectDiv.children[1].innerHTML;
      let project = getProject(projectTitle);
      selectProject(project);
   }

   const todoClickEvent = (event) => {
      let todoDiv = event.currentTarget;
      todoDiv.classList.toggle('completed');
      let todo = getTodo(getSelectedProject(), todoDiv.children[0].children[1].innerHTML);
      todo.completed = !todo.completed;
      console.log(todo);
   }

   const addProjectPressEnter = (event) => {
      if (event.keyCode === 13) {
         event.preventDefault();
         let newProject = createProject(event.currentTarget.value);
         addProjectDiv(newProject);
         event.currentTarget.value = null;
         selectProject(newProject);
      }
   }

   const addTodoPressEnter = (event) => {
      if (event.keyCode === 13) {
         event.preventDefault();
         let currentProject = getSelectedProject();
         let newTodo = createTodo(currentProject.title, event.currentTarget.value, 'no date specified', false); 
         currentProject.addTodo(newTodo);
         event.currentTarget.value = null;
         addTodoDiv(newTodo);
         renderer.updateProjectTodoCount(currentProject);
      }
   }

   const addProjectDiv = (project) => {
      let projectDiv = renderer.addProject(project);
      projectDiv.addEventListener('click', projectClickEvent);
      projects.push(project);
   }

   const addTodoDiv = (todo) => {
      let todoDiv = renderer.addTodo(todo);
      todoDiv.addEventListener('click', todoClickEvent);
   }

   let projectElements = elements.getProjects();
   projectElements.forEach(project => {
      project.addEventListener('click', projectClickEvent);
   });

   let todoElements = elements.getTodos();
   todoElements.forEach(todo => {
      todo.addEventListener('click', todoClickEvent);
   })

   
   let addProjectInputField = elements.getAddProjectInputField();
   addProjectInputField.addEventListener("keyup", addProjectPressEnter);

   let addTodoInputField = elements.getAddTodoInputField();
   addTodoInputField.addEventListener("keyup", addTodoPressEnter);

   return {
      addProjectDiv
   }
})();

export { controller };