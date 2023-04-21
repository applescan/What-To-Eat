import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../../src/utils/api";
import GroceryEntries from "./GroceryEntries";
import React from 'react'
import Image from "next/image";
import Plus from "../../public/plus.png"

export default function AddList() {

    const [title, setTitle] = useState("");
    const { data: session, status } = useSession();
    const utils = api.useContext();
    const postMessage = api.grocery.postMessage.useMutation({
        onMutate: async (newEntry) => {
            await utils.grocery.getAll.cancel();
            utils.grocery.getAll.setData(undefined, (prevEntries) => {
                if (prevEntries) {
                    return [
                        {
                            id: Date.now(), // generate a unique ID for the new entry
                            title: newEntry.title,
                            checked: false,
                        },
                        ...prevEntries,
                    ];
                } else {
                    return [
                        {
                            id: Date.now(), // generate a unique ID for the new entry
                            title: newEntry.title,
                            checked: false,
                        },
                    ];
                }
            });
        }
    });

    const deleteAllEntries = api.grocery.deleteAll.useMutation({
        onMutate: async () => {
            await utils.grocery.getAll.cancel();
            utils.grocery.getAll.setData(undefined, (prevEntries) => []);
        },
        onSettled: async () => {
            await utils.grocery.getAll.invalidate();
        },
    });

    if (status !== "authenticated") return null;

    return (
        <section>
            <div className='mt-2 justify-center gap-6 bg-indigo-50 rounded-md '>

                <div className="p-8 space-y-4 border-b">
                    <span className='text-indigo-600 font-bold text-xl'>
                        Grocery List
                    </span>
                    <div className='text-gray-800 text-lg font-semibold'>
                        <form
                            className="flex gap-2"
                            onSubmit={(event) => {
                                event.preventDefault();
                                postMessage.mutate({
                                    title,
                                });
                                setTitle("");
                            }}
                        >
                            <input
                                type="text"
                                className="text-base bg-teal-50 border-2 border-indigo-200 text-gray-700 rounded-lg focus:ring-teal-500 focus:border-teal-500 p-2"
                                placeholder="Your list to add..."
                                minLength={2}
                                maxLength={100}
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                required
                            />
                            <button type="submit">
                                <Image
                                    src={Plus}
                                    width={30}
                                    height={30}
                                    alt="What to eat logo"
                                />
                            </button>
                        </form>
                    </div>
                    <button className='px-3 py-3 rounded-lg w-full font-semibold text-sm duration-150 text-gray-500 flex justify-end underline'
                        onClick={() => {
                            if (confirm("Are you sure you want to delete all entries?")) {
                                deleteAllEntries.mutate(
                                    {},
                                    {
                                        onSuccess: () => { },
                                        onError: () => { },
                                    }
                                );
                            }
                        }}
                    >
                        Delete All Entries
                    </button>
                </div>
                <div className="p-8 space-y-4 border-b">
                    <GroceryEntries></GroceryEntries>
                </div>
            </div>

        </section>
    )
};
