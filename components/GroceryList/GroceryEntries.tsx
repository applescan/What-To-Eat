import React from 'react'
import { api } from "../../src/utils/api";
import { useState } from "react";
import Loading from 'components/Loading';

export default function GroceryEntries() {
    const [selectedIds, setSelectedIds] = useState([]);
    const { data: groceryEntries, isLoading } = api.grocery.getAll.useQuery();

    const updateOne = (entry) => {
        if (selectedIds.includes(entry.id)) {
            setSelectedIds((prevSelected) =>
                prevSelected.filter((id) => id !== entry.id)
            );
        } else {
            setSelectedIds((prevSelected) => [...prevSelected, entry.id]);
        }
    };

    if (isLoading) return <div> <Loading></Loading></div>;

    return (
        <div className="flex flex-col gap-4">
            {groceryEntries?.length === 0 ? (
                <p className='font-semibold text-m'> No entries found.</p>
            ) : (
                groceryEntries?.map((entry, index) => {
                    return (
                        <div key={index} className="flex items-center">
                            <label>
                                <input
                                    type="checkbox"
                                    onChange={() => updateOne(entry)}
                                    className="mr-2"
                                />
                                <span className='font-semibold text-m'> {entry.title}</span></label>
                        </div>
                    );
                })
            )}
        </div>
    );
}
