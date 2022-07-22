import React from 'react'

interface Props {
    handleChange: (index: number, value: string) => void
    index: number
}

const Input = ({ handleChange, index }: Props) => {
    return (
        <>
            {index % 2 !== 0 && <span className="text-gray-400 text-lg hidden sm:block text-center">or</span>}
            <input type="text" name="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(index, e.target.value);
            }} placeholder="Option" className="border outline-none border-gray-500 rounded-sm py-2 px-3 bg-transparent text-white" required />
        </>
    )
}

export default Input