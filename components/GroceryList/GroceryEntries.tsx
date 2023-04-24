import React from 'react';
import { api } from '../../src/utils/api';
import { useState } from 'react';
import Loading from 'components/Loading';

interface GroceryEntry {
  id: string;
  title: string;
}

export default function GroceryEntries() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data: groceryEntries, isLoading } = api.grocery.getAll.useQuery();

  const updateOne = (entry: GroceryEntry) => {
    if (selectedIds.includes(entry.id)) {
      setSelectedIds((prevSelected) => prevSelected.filter((id) => id !== entry.id));
    } else {
      setSelectedIds((prevSelected) => [...prevSelected, entry.id]);
    }
  };

  if (isLoading) return <div> <Loading></Loading></div>;

  return (
    <div className="flex flex-col gap-4">
      {groceryEntries?.length === 0 ? (
        <p className="font-semibold text-m"> No entries found.</p>
      ) : (
        groceryEntries?.map((value: GroceryEntry, index: number, array: GroceryEntry[]) => {
          return (
            <div key={index} className="flex items-center">
              <label>
                <input type="checkbox" onChange={() => updateOne(value)} className="mr-2" />
                <span className="font-semibold text-m"> {value.title}</span>
              </label>
            </div>
          );
        })
      )}
    </div>
  );
}

