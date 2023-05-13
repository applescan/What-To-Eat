import React from 'react'
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

//local import
import { api } from "../../src/utils/api";
import GroceryEntries from "./GroceryEntries";
import Plus from "../../public/plus.png"
import STATUS from "constants";


const AddList: React.FC = () => {

    const [title, setTitle] = useState("");
    const { data: session, status } = useSession();
    const utils = api.useContext();

    const postMessage = api.grocery.postMessage.useMutation({
        onMutate: async (newEntry) => {
            try {
                await utils.grocery.getAll.cancel();
                utils.grocery.getAll.setData(undefined, (prevEntries: any) => {
                    if (prevEntries) {
                        return [
                            {
                                userId: session?.user.id,
                                title: newEntry.title,
                            },
                            ...prevEntries,
                        ];
                    }
                    return [
                        {
                            userId: session?.user.id,
                            title: newEntry.title,
                        },
                    ];
                });
            } catch (error) {
                console.error(error);
            }
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

    if (status !== STATUS.AUTHENTICATE) return null;

    return (
        <section>
            <div className='mt-2 justify-center gap-6 bg-indigo-50 rounded-md '>

                <div className="p-8 space-y-4 border-b">
                    <span className='text-indigo-600 font-bold text-xl'>
                        Grocery List
                    </span>
                    <div className='text-gray-800 text-lg font-semibold'>
                        <form
                            className="flex mx-auto justify-between gap-2"
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
                                className="text-base bg-teal-50 border-2 border-indigo-200 text-gray-700 rounded-lg focus:ring-teal-500 focus:border-teal-500 p-2 w-5/6"
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

export default AddList