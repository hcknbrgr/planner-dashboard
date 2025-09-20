"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SubtaskItemData {
  id: number;
  todo: number;
  step: number;
  description: string;
  completed: boolean;
}

interface PageProps {
  params: Promise<{ subtaskId: number }>;
}

/**
 * Fetches a subtask by ID
 * @param {number} id The ID of the subtask to retrieve.
 */
async function getSubtask(id: number) {
  const res = await fetch(`http://127.0.0.1:8000/api/subtasks/${id}/`);
  if (!res.ok) {
    throw new Error("Failed to retrieve subtask");
  }
  return res.json();
}

/**
 * Updates a subtask by ID.
 * @param {number} id The ID of the subtask to update.
 * @param {Object} data The updated data for the subtask.
 */
async function updateSubtask(
  id: number,
  data: Omit<SubtaskItemData, "id">,
): Promise<SubtaskItemData> {
  console.log(`PUT request to /api/subtasks/${id}/ with data:`, data);
  const res = await fetch(`http://127.0.0.1:8000/api/subtasks/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update subtask");
  }
  return res.json();
}

const Page = ({ params }: PageProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<SubtaskItemData, "id">>({
    todo: 0,
    step: 1,
    description: "",
    completed: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subtaskId, setSubtaskId] = useState<number | null>(null);

  // Resolve params promise and set subtaskId
  useEffect(() => {
    const fetchSubtaskId = async () => {
      try {
        const resolvedParams = await params;
        setSubtaskId(resolvedParams.subtaskId);
      } catch (error) {
        setError("Failed to retrieve subtask ID");
      }
    };
    fetchSubtaskId();
  }, [params]);

  /**
   * Handles form submission.
   * @param {Event} event The form submission event.
   */
  const onFinish = (event: FormEvent<HTMLFormElement>) => {
    console.log("submit invoked");
    console.log("Form data being sent:", formData);
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    if (subtaskId != null) {
      updateSubtask(subtaskId, formData)
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

  // Fetch subtask data on component mount
  useEffect(() => {
    if (subtaskId != null) {
      const fetchData = async () => {
        try {
          const data = await getSubtask(subtaskId);
          setFormData({
            todo: data.todo,
            step: data.step,
            description: data.description,
            completed: data.completed,
          });
        } catch (error: any) {
          setError(error.message);
        }
      };
      fetchData();
    }
  }, [subtaskId]);

  return (
    <form name="update subtask form" onSubmit={onFinish}>
      <input type="hidden" name="todo" value={formData.todo} />
      <div className="form-item">
        <label htmlFor="step">Step</label>
        <input
          required
          type="number"
          min="1"
          id="step"
          name="step"
          value={formData.step}
          onChange={(e) =>
            setFormData({ ...formData, step: parseInt(e.target.value) })
          }
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
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
