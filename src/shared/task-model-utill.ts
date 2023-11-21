import { convertToReadableFormat } from "./date-time-format-utill";
import { Todo } from "./todo";

export class TaskModelUtil {
    
    public static mapRawTodoToTodo = (rawTodo: any): Todo => {
    return {
        id: rawTodo.id || "",
        name: rawTodo.name || "",
        description: rawTodo.description || "",
        datetime: convertToReadableFormat(rawTodo.created_date_time).toString() || "",
        isComplete: rawTodo.is_complete || false,
    };
    };
    
    public static mapRawTodosToTodos = (rawTodos: any[]): Todo[] => {
    return rawTodos.map((rawTodo) => this.mapRawTodoToTodo(rawTodo));
    };      
}