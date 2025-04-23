"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface TodoItemProps {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}
interface SubtaskItemProps {
  id: number;
  todo: number;
  step: number;
  description: string;
  completed: boolean;
}

interface TodoItemData {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface SubtaskItemData {
  id: number;
  todo: number;
  step: number;
  description: string;
  completed: boolean;
}

async function deleteItem(id: number): Promise<void> {
  const res = await fetch(`http://127.0.0.1:8000/api/todos/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to retrieve");
  }
}

async function getTodoData() {
  const res = await fetch("http://127.0.0.1:8000/api/todos/");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

async function getSubtaskData() {
  const res = await fetch(`http://127.0.0.1:8000/api/subtasks/`);
  if (!res.ok) {
    throw new Error("Failed to fetch subtask data");
  }
  return res.json();
}

async function decomposeTask(id: number): Promise<void> {
  const res = await fetch(
    `http://127.0.0.1:8000/api/todos/${id}/generate_subtasks/`,
    {
      method: "POST",
    },
  );
  if (!res.ok) {
    throw new Error("Error on decomposing task");
  }
}

const SubtaskItem = ({
  id,
  todo,
  step,
  description,
  completed,
}: SubtaskItemProps) => {
  return (
    <div className="subtask-item">
      <div className="subtask-item-info">
        <div className="subtask-item-todoId">Todo Id: {todo}</div>
        <div className="subtask-item-step">Step: {step}</div>
        <div className="subtask-item-description">{description}</div>
        <div className="subtask-item-completed">
          Completed: {completed ? "Yes" : "No"}
        </div>
      </div>
    </div>
  );
};

const TodoItem = ({
  id,
  title,
  description,
  completed,
  onEdit,
  onDelete,
}: TodoItemProps) => {
  return (
    <div className="todo-item" data-id={id}>
      <div className="todo-item-info">
        <div className="todo-item-title">{title}</div>
        <div className="todo-item-description">{description}</div>
        <div className="todo-item-completed">
          Completed: {completed ? "Yes" : "No"}
        </div>
      </div>
      <div className="todo-item-actions">
        <button className="edit-button" onClick={() => onEdit(id)}>
          Edit
        </button>
        <button
          className="delete-button"
          onClick={() => {
            deleteItem(id).then(() => onDelete(id));
          }}
        >
          Delete
        </button>
        <button className="decompose-button" onClick={() => decomposeTask(id)}>
          !
        </button>
      </div>
    </div>
  );
};

export default function Page() {
  const [todoItems, setTodoItems] = useState<TodoItemData[] | null>(null);
  const [subtaskItems, setSubtaskItems] = useState<SubtaskItemData[] | null>(
    null,
  );
  const router = useRouter();
  const params = useSearchParams();

  // State for displaying a success message
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState({
    show: false,
    type: "", // either 'add' or 'update'
  });

  // Fetch todo items on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getTodoData();
      setTodoItems(data);
    };
    fetchData().catch(console.error);
  }, []);

  // Fetch subtask items on component mount
  useEffect(() => {
    const fetchSubtaskData = async () => {
      const subtaskData = await getSubtaskData();
      setSubtaskItems(subtaskData);
    };
    fetchSubtaskData().catch(console.error);
  }, []);

  // Detect changes in URL parameters for success messages
  useEffect(() => {
    const actionType = params.get("action") || "";

    if (!!actionType) {
      setDisplaySuccessMessage({
        type: actionType,
        show: true,
      });
      router.replace("/");
    }
  }, [params, router]);

  // Automatically hide the success message after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (displaySuccessMessage.show) {
        setDisplaySuccessMessage({ show: false, type: "" });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [displaySuccessMessage.show]);

  // Handle deletion of a todo list item
  const handleDelete = (id: number) => {
    setTodoItems((items) => items?.filter((item) => item.id !== id) ?? null);
  };

  return (
    <div>
      <button className="add-button" onClick={() => router.push("/add")}>
        Add
      </button>
      {displaySuccessMessage.show && (
        <p className="success-message">
          {displaySuccessMessage.type === "add" ? "Added a" : "Modified a"} todo
          list item.
        </p>
      )}
      {todoItems ? (
        todoItems.map((item) => (
          <TodoItem
            key={item.id}
            id={item.id}
            title={item.title}
            completed={item.completed}
            description={item.description}
            onEdit={() => router.push(`/update/${item.id}`)}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p>Loading...</p>
      )}
      {subtaskItems ? (
        subtaskItems.map((subtask) => (
          <SubtaskItem
            key={subtask.id}
            id={subtask.id}
            todo={subtask.todo}
            step={subtask.step}
            description={subtask.description}
            completed={subtask.completed}
          />
        ))
      ) : (
        <p>Subtasks Loading...</p>
      )}
    </div>
  );
}
