"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Sends a POST request to create a new todo list item.
 * @param {Object} data Thetodo item data to be sent.
 */

async function createTodo(data) {
  const res = await fetch("http://127.0.0.1:8000/api/todos/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create data");
  }

  return res.json();
}

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /*
   * Handles the form submission.
   * @param {Event} event The form submission event.
   */
  const onFinish = (event) => {
    event.preventDefault();
    setIsLoading(true);
    createTodo(formData)
      .then(() => {
        // Navigate to the main page with a query parameter indicating success
        router.replace("/?action=add");
      })
      .catch(() => {
        setError("An error occurred");
        setIsLoading(false);
      });
  };

  // CLeanup effect for resetting loading state
  useEffect(() => {
    return () => setIsLoading(false);
  }, []);

  return (
    <form onSubmit={onFinish}>
      <div className="form-item">
        <label htmlFor="title">Title</label>
        <input
          required
          name="title"
          value={formData.title}
          onChange={(event) =>
            setFormData({ ...formData, title: event.target.value })
          }
        />
      </div>
      <div className="form-item">
        <label htmlFor="description">Description</label>
        <input
          required
          name="description"
          value={formData.description}
          onChange={(event) =>
            setFormData({ ...formData, description: event.target.value })
          }
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <div>
        <button disabled={isLoading} className="add-button" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default Page;
