import React, { useEffect } from 'react';
import { api } from '../../src/utils/api';
import { useState } from 'react';
import Loading from 'components/Loading';

interface GroceryEntry {
  id: string;
  title: string;
}

const GroceryEntries: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const storedIds = localStorage.getItem('selectedIds');
    return storedIds ? JSON.parse(storedIds) : [];
  });

  const { data: groceryEntries, isLoading } = api.grocery.getAll.useQuery();

  const updateOne = (entry: GroceryEntry) => {
    if (selectedIds.includes(entry.id)) {
      setSelectedIds((prevSelected) => prevSelected.filter((id) => id !== entry.id));
    } else {
      setSelectedIds((prevSelected) => [...prevSelected, entry.id]);
    }
  };

  useEffect(() => {
    localStorage.setItem('selectedIds', JSON.stringify(selectedIds));
  }, [selectedIds]);

  if (isLoading) return <div className="mx-auto flex items-center">
    <Loading></Loading>
  </div>;

  const groceryColumns = groceryEntries?.reduce((columns: any, entry: GroceryEntry, index: number) => {
    const columnIdx = Math.floor(index / 5);
    if (!columns[columnIdx]) {
      columns[columnIdx] = [];
    }
    columns[columnIdx].push(
      <div key={index} className="flex items-center">
        <label>
          <input
            type="checkbox"
            onChange={() => updateOne(entry)}
            className="mr-2"
            checked={selectedIds.includes(entry.id)}
          />
          <span className="font-semibold text-m">{entry.title}</span>
        </label>
      </div>
    );
    return columns;
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {groceryEntries?.length === 0 ? (
        <p className="font-semibold text-m">No entries found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groceryColumns?.map((column: any, index: number) => (
            <div key={index}>
              {column}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroceryEntries