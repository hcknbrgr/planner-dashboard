"use client";

import { FormEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface TodoItemData {
  title: string;
  description: string;
  completed: boolean;
}

interface PageProps {
  params: Promise<{ todoId: number }>; // Ensure this matches the type of the ID being passed
}

/**
 * Fetches a todo list item by ID
 * @param {number} id The ID of the todo list item to retrieve.
 */
async function getTodo(id: number) {
  const res = await fetch(`http://127.0.0.1:8000/api/todos/${id}/`);
  if (!res.ok) {
    throw new Error("Failed to retrieve todo list item");
  }
  return res.json();
}

/**
 * Updates a todo list item by ID.
 * @param {number} id The ID of the todo list item to update.
 * @param {Object} data The udpated data for the todo list item.
 */
async function updateTodo(
  id: number,
  data: TodoItemData,
): Promise<TodoItemData> {
  const res = await fetch(`http://127.0.0.1:8000/api/todos/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update todo list item");
  }
  return res.json();
}

const Page = ({ params }: PageProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<TodoItemData>({
    title: "",
    description: "",
    completed: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [todoId, setTodoId] = useState<number | null>(null);

  // Resolve params promise and set todoId
  useEffect(() => {
    const fetchTodoId = async () => {
      try {
        const resolvedParams = await params;
        setTodoId(resolvedParams.todoId);
      } catch (error) {
        setError("Failed to retrieve todo ID");
      }
    };
    fetchTodoId();
  }, [params]);

  /**
   * Handles form submission.
   * @param {Event} event The form submission event.
   */
  const onFinish = (event: FormEvent<HTMLFormElement>) => {
    console.log("submit invoked");
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    if (todoId != null) {
      updateTodo(todoId, formData)
        .then(() => {
          router.replace("/?action=update");
        })
        .catch((error) => {
          setError("An error occurred");
          setIsLoading(false);
        });
    }
  };

  const handleCancel = () => {
    console.log("Cancel invoked");
    router.push("/", { scroll: false });
  };

  // Cleanup effect for resetting loading state
  useEffect(() => {
    return () => setIsLoading(false);
  }, []);

  // Fetch todo list item data on component mount
  useEffect(() => {
    if (todoId != null) {
      const fetchData = async () => {
        try {
          const data = await getTodo(todoId);
          setFormData({
            title: data.title,
            description: data.description,
            completed: data.completed,
          });
        } catch (error: any) {
          setError(error.message);
        }
      };
      fetchData();
    }
  }, [todoId]);

  return (
    <form name="update form" onSubmit={onFinish}>
      <div className="form-item">
        <label htmlFor="title">Title</label>
        <input
          required
          id="title"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div className="form-item">
        <label htmlFor="description">Description</label>
        <input
          required
          id="description"
          name="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>
      <div className="radioGroup">
        <label htmlFor="completed">Completed</label>
        <input
          type="checkbox"
          name="completed"
          id="completed"
          value="completed"
          checked={formData.completed}
          onChange={(e) =>
            setFormData({ ...formData, completed: e.target.checked })
          }
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <div>
        <button
          disabled={isLoading}
          name="submit"
          className="add-button"
          type="submit"
        >
          Submit
        </button>

        <button
          type="button"
          className="cancel-button"
          onClick={(e) => {
            e.stopPropagation();
            handleCancel();
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Page;
