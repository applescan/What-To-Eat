import React, { useEffect, useState } from 'react';

//local imports
import { api } from '../../src/utils/api';
import Loading from 'components/Loading';
import { HiPencil } from 'react-icons/hi';
import { MdClose, MdCheck } from 'react-icons/md';

interface GroceryEntry {
  id: string;
  title: string;
}

const GroceryEntries: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const storedIds = localStorage.getItem('selectedIds');
    return storedIds ? JSON.parse(storedIds) : [];
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitles, setEditTitles] = useState<{ [key: string]: string }>({});

  const { data: groceryEntries, refetch } = api.grocery.getAll.useQuery();
  const updateMutation = api.grocery.updateOne.useMutation({
    onSuccess: () => refetch(),
  });
  const deleteMutation = api.grocery.deleteOne.useMutation({
    onSuccess: () => refetch(),
  });

  const startEditing = (entry: GroceryEntry) => {
    setEditingId(entry.id);
    setEditTitles((prevEditTitles) => ({
      ...prevEditTitles,
      [entry.id]: entry.title,
    }));
  };

  const updateOne = async (id: string, title: string) => {
    try {
      await updateMutation.mutate({ id, title });
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update entry: ", error);
    }
  };

  const deleteOne = async (id: string) => {
    try {
      await deleteMutation.mutate({ id });
    } catch (error) {
      console.error("Failed to delete entry: ", error);
    }
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  useEffect(() => {
    localStorage.setItem('selectedIds', JSON.stringify(selectedIds));
  }, [selectedIds]);

  if (!groceryEntries) return <div className="mx-auto flex items-center">
    <Loading></Loading>
  </div>;

  return (
    <div className="flex flex-col gap-4">
      {groceryEntries.length === 0 ? (
        <p className="font-semibold text-m mx-auto flex items-center">No entries found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groceryEntries.map((entry, index) => (
            <div key={index} className="sm:flex sm:flex-col sm:items-start md:flex-row md:justify-between md:items-center space-x-4 whitespace-wrap">
              <label className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(entry.id)}
                  onChange={() => toggleSelected(entry.id)}
                />
                {editingId === entry.id ? (
                  <input
                    type="text"
                    value={editTitles[entry.id] || ""}
                    onChange={(e) =>
                      setEditTitles((prevEditTitles) => ({
                        ...prevEditTitles,
                        [entry.id]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <span
                    className={`font-semibold text-m ${selectedIds.includes(entry.id) ? "line-through" : ""}`}
                  >
                    {entry.title}
                  </span>
                )}
              </label>
              <div className="flex text-indigo-500 space-x-3 sm:space-x-2 sm:mt-2 justify-end">
                {editingId === entry.id ? (
                  <button onClick={() => updateOne(entry.id, editTitles[entry.id] || "")}>
                    <MdCheck className="sm:text-xl" />
                  </button>
                ) : (
                  <button onClick={() => startEditing(entry)}>
                    <HiPencil className="sm:text-xl" />
                  </button>
                )}
                <button onClick={() => deleteOne(entry.id)}>
                  <MdClose className="sm:text-xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroceryEntries;
