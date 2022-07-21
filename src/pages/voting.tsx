import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { ref, onValue, update } from "firebase/database";
import { db } from "../firebase"
import Cookies from 'js-cookie'
import { Link } from "react-router-dom"

interface Poll {
    closed: boolean
    options: string[]
    title: string
    votes: number[]
}

const Voting = () => {
    let isCreatedByCurrentUser = Cookies.get('pollCreatedByCurrentUser') ? true : false
    let params = useParams();
    let [voted, setVoted] = useState<boolean>(false);
    let [closing, setClosing] = useState<boolean>(false);
    let [closed, setClosed] = useState<boolean>(false);
    let [err, setErr] = useState<string>("");
    let [loading, setLoading] = useState<boolean>(false);
    const [poll, setPoll] = useState<Poll>({
        title: "",
        options: [],
        votes: [],
        closed: false
    })
    let totalVotes: number = poll.votes.length > 0 ? poll.votes.reduce((total, v) => total + v) : 0;

    useEffect(() => {
        setLoading(true)
        const pollRef = ref(db, 'polls/' + params.pollId);
        onValue(pollRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            if (data) {
                setPoll(data)
                setLoading(false)
                setErr("")
            }
            else {
                setLoading(false)
                setErr("Poll not found")
            }
        });
    }, [params])

    const handle = (index: number) => {

        let state: Poll = { ...poll }
        state.votes[index] = state.votes[index] + 1

        const updates = {
            [`polls/${params.pollId}`]: state
        };
        update(ref(db), updates).then(() => {
            Cookies.set('voted', "true", { path: params.pollId ? `/${params.pollId}` : "" })
            setVoted(true)
        }).catch(err => console.error(err));
    }

    const handleToggle = () => {
        let state: Poll = { ...poll }
        state.closed = !state.closed
        setClosing(true)
        const updates = {
            [`polls/${params.pollId}`]: state
        };
        update(ref(db), updates).then(() => {
            Cookies.set('voted', "true", { path: params.pollId ? `/${params.pollId}` : "" })
            setClosing(false)
            setClosed(state.closed)
        }).catch(err => {
            console.error(err)
            setClosing(false)
            setClosed(false)
        });
    }

    return (
        <section className="max-w-lg mx-auto block">
            <Link to="/" className="text-xs block mb-5 font-medium text-white bg-[#1C538E] w-fit p-2 opacity-70 transition-transform hover:scale-105 duration-200 hover:opacity-100">Back to home</Link>
            {!loading && !err ? <>{poll.title && <h1 className="text-xl font-medium block w-full bg-transparent pb-3 sm:text-2xl lg:text-3xl mb-10 text-white border-b border-gray-400">{poll.title}</h1>}
                {((isCreatedByCurrentUser || poll.closed) || Cookies.get('voted')) ? poll.options.map((value: string, i: number) => {
                    return <div key={i} className="block w-full text-white font-medium mb-3 rounded-sm text-sm  border border-[#1C538E] relative">
                        <span style={{
                            width: `${((poll.votes[i] / totalVotes) * 100).toFixed()}%`
                        }} className={`absolute w-0 h-full top-0 left-0 bg-[#1C538E]`}></span>
                        <div className="w-full p-2 h-full relative z-10 text-left flex justify-between items-center" ><span>{value}</span>{<span>{poll.votes[i] && ((poll.votes[i] / totalVotes) * 100).toFixed()}%</span>}</div>
                    </div>
                }) :
                    poll.options.map((value: string, i: number) => {
                        return <div key={i} className="block w-full text-white font-medium mb-3 rounded-sm text-sm border transition-transform hover:scale-105 duration-200 border-[#1C538E] relative">
                            <span style={{
                                width: `${voted ? ((poll.votes[i] / totalVotes) * 100).toFixed() : 0}%`
                            }} className={`absolute w-0 h-full top-0 left-0 bg-[#1C538E]`}></span>
                            <button disabled={voted} className="w-full p-2 h-full relative z-10 text-left flex justify-between items-center" type="button" onClick={() => handle(i)}><span>{value}</span>{voted && <span>{((poll.votes[i] / totalVotes) * 100).toFixed()}%</span>}</button></div>
                    })}
                {poll.title && isCreatedByCurrentUser && <button type="button" style={{
                    opacity: closing ? "opacity-50" : "opacity-100"
                }} disabled={closing} className="outline-none mt-10 w-fit block mx-auto text-sm bg-[#1C538E] text-white py-2 px-5 rounded-sm transition-transform hover:scale-105 duration-200" onClick={handleToggle}>{closing ? poll.closed ? "Opening poll" : "Closing poll" : closed ? "Poll closed, Re-open" : "Close poll"}</button>}
                {(isCreatedByCurrentUser || poll.closed) && <p className="text-white mt-5 text-xs font-medium">Votes: {totalVotes}</p>}
                {poll.closed && <p className="text-white mt-3 text-xs font-medium opacity-70">This poll has been closed. Here are the results</p>}</> : loading && !err ? <p className="text-white mt-5 font-medium text-center">Loading...</p> : <p className="text-white mt-5 font-medium text-center">Poll not found</p>}
        </section>
    )
}

export default Voting