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
  }

  public markAsDone(index){
    this.todoList[index].statusSelected = "Done";
    let todo = this.todoList[index];
    this.todoList.splice(index,1);
    this.todoList.push(todo);

    /* this.completedTodoList.push(this.todoList[index]);
    this.todoList.splice(index,1); */
  }

  public markAsOpen(index){
    this.todoList[index].statusSelected = "Open";
    let todo = this.todoList[index];
    this.todoList.splice(index,1);
    this.todoList.push(todo);
    /* this.todoList.push(this.completedTodoList[index]);
    this.completedTodoList.splice(index,1); */
  }

  public editTodo(index, todoData): any{
    this.todoList[index]=todoData;

  }
}
