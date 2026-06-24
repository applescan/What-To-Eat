import React from 'react'
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

//local import
import { api } from "../../src/utils/api";
import GroceryEntries from "./GroceryEntries";
import Plus from "../../public/plus.png"
import STATUS from "components/_constants";


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
        },
        onSuccess: () => {
            utils.grocery.getAll.refetch();
        }
    });
    
    
    const deleteAllEntries = api.grocery.deleteAll.useMutation({
        onMutate: async () => {
            await utils.grocery.getAll.cancel();
            utils.grocery.getAll.setData(undefined, (prevEntries) => []);
        },
        onSuccess: () => {
            utils.grocery.getAll.refetch();
        },
        onError: () => {
            // Handle error here
        }
    });
    

    if (status !== STATUS.AUTHENTICATE) return null;

    return (
        <section>
            <div className='mt-2 justify-center gap-6 rounded-xl border border-slate-200 bg-slate-50'>

                <div className="space-y-4 border-b border-slate-200 p-8">
                    <span className='text-xl font-bold text-slate-900'>
                        Grocery List
                    </span>
                    <div className='text-lg font-semibold text-slate-800'>
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
                                className="w-5/6 rounded-lg border border-slate-300 bg-white p-2 text-base text-slate-700 outline-none transition focus:border-slate-400"
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
                    <button className='flex w-full justify-end rounded-lg px-3 py-3 text-sm font-semibold text-slate-500 underline duration-150'
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
                <div className="space-y-4 border-b border-slate-200 p-8">
                    <GroceryEntries></GroceryEntries>
                </div>
            </div>

        </section>
    )
};

export default AddList
