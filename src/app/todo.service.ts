import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  todoList:any = [];
  completedTodoList:any = [];
  constructor() { }

  public createTodo(todoData){
    
    this.todoList.push(todoData);
    console.log("todo pushed"+todoData);
    console.log("todo list-"+ this.todoList[this.todoList.length -1]);
    console.log("Todo Succesfully created")
  }

  public markAsDone(index){
    this.todoList[index].statusSelected = "Done";
    let todo = this.todoList[index];
    console.log("marked as done"+ this.todoList[index]);
    console.log("Updated status:"+this.todoList[index].statusSelected);
    this.todoList.splice(index,1);
    this.todoList.push(todo);

    /* this.completedTodoList.push(this.todoList[index]);
    console.log("completed todo list-"+ this.completedTodoList);
    this.todoList.splice(index,1); */
  }

  public markAsOpen(index){
    this.todoList[index].statusSelected = "Open";
    let todo = this.todoList[index];
    console.log("marked as open"+ this.todoList[index]);
    console.log("Updated status:"+this.todoList[index].statusSelected);
    this.todoList.splice(index,1);
    this.todoList.push(todo);
    /* this.todoList.push(this.completedTodoList[index]);
    console.log("open todo list-"+ this.todoList);
    this.completedTodoList.splice(index,1); */
  }

  public editTodo(index, todoData): any{
    this.todoList[index]=todoData;
    console.log(this.todoList[index]);

  }
}
