"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

async function deleteMenu(id) {
  const res = await fetch(`http://127.0.0.1:8000/api/menu/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to retrieve");
  }
  return Promise.resolve();
}

async function getData() {
  const res = await fetch("http://127.0.0.1:8000/api/menu/");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

const TodoItem = ({ id, title, description, onEdit, onDelete }) => {
  return (
    <div className="todo-item" data-id={id}>
      <div className="todo-item-info">
        <div className="todo-item-title">{title}</div>
        <div className="todo-item-description">{description}</div>
      </div>
      <div className="todo-item-actions">
        <button className="edit-button" onClick={onEdit}>
          Edit
        </button>
        <button
          className="delete-button"
          onClick={() => {
            deleteMenu(id).then(() => onDelete(id));
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default function Page() {
  const [todoItems, setMenuItems] = useState(null);
  const router = useRouter();
  const params = useSearchParams();

  // State for displaying a success message
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState({
    show: false,
    type: "", // either 'add' or 'update'
  });

  // Fetch menu items on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setMenuItems(data);
    };
    fetchData().catch(console.error);
  }, []);

  // Detect changes in URL parameters for success messages
  useEffect(() => {
    if (!!params.get("action")) {
      setDisplaySuccessMessage({
        type: params.get("action"),
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

  // Handle deletion of a menu item
  const handleDelete = (id) => {
    setMenuItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <button className="add-button" onClick={() => router.push("/add")}>
        Add
      </button>
      {displaySuccessMessage.show && (
        <p className="success-message">
          {displaySuccessMessage.type === "add" ? "Added a" : "Modified a"} menu
          item.
        </p>
      )}
      {todoItems ? (
        todoItems.map((item) => (
          <TodoItem
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            onEdit={() => router.push(`/update/${item.id}`)}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
