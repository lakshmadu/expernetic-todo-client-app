export interface SaveTodo {
    name: string;
    description: string;
}

export interface Todo {
    id: number;
    name: string;
    description: string;
    datetime?: string;
    isComplete?: boolean;
}