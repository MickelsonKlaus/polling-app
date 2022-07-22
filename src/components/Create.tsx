import React, { useState } from 'react'
import Input from "./Input"
import { ref, set, child, push, } from "firebase/database";
import { db } from '../firebase';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'

const Create = () => {
    const navigate = useNavigate()
    const [optionNum, setOptionNum] = useState<number>(2)
    const [title, setTitle] = useState<string>("");
    const [options, setOptions] = useState<string[]>([])
    const [creating, setCreating] = useState<boolean>(false)

    const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let target = e.target;

        target.classList.remove("text-gray-400")
        target.classList.add("text-white")
        if (target.value !== "") {
            target.style.height = target.scrollHeight + "px"
        }
        else {
            target.style.height = "auto"
        }
        setTitle(target.value)
    }

    const handleChange = (index: number, value: string) => {
        setOptions((prevState): string[] => {
            let state: string[] = [...prevState]
            state[index] = value
            return state
        })
    }

    const addOption = (): void => {
        setOptionNum(current => current + 1)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const newPollKey = push(child(ref(db), 'polls')).key;
        let votes: number[] = []
        options.forEach(() => {
            votes.push(0)
        })
        setCreating(true)
        set(ref(db, 'polls/' + newPollKey), {
            closed: false,
            title,
            options,
            votes
        }).then(() => {
            setCreating(false)
            Cookies.set('pollCreatedByCurrentUser', "true", { path: newPollKey ? `/${newPollKey}` : "" })
            navigate(`/${newPollKey}`, { state: { pollCreatedByCurrentUser: true } })
        }).catch(err => {
            setCreating(true)
            console.error(err)
        });
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea required name="question" onChange={handleTyping} rows={1} placeholder="Poll" className="text-xl block w-full bg-transparent pb-3 overflow-hidden sm:text-2xl lg:text-3xl mb-10 text-gray-400 border-b-2 border-gray-400 px-3 outline-none resize-none first-letter:capitalize break-words h-auto" />
                <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-5">
                    {Array(optionNum).fill("").map((input: string, i: number) => {
                        return <Input key={i} handleChange={handleChange} index={i} />
                    })}
                </div>
                <button type="button" disabled={creating} className="outline-none mt-5 w-fit text-sm text-gray-400 transition-transform hover:scale-105 duration-200" onClick={addOption}>+ Add option</button>
                <button type="submit" disabled={creating} className="outline-none mt-5 w-fit block mx-auto text-sm bg-[#1C538E] text-white py-2 px-5 rounded-sm transition-transform hover:scale-105 duration-200" style={{
                    opacity: creating ? "opacity-50" : "opacity-100"
                }}>{creating ? "Creating" : "Create"}</button>
            </form>
        </div>
    )
}

export default Create