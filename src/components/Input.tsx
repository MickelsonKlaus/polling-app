import React from 'react'

interface Props {
    handleChange: (index: number, value: string) => void
    index: number,
    handleClose: (e: React.MouseEvent<HTMLImageElement>, index: number) => void
}

const Input = ({ handleChange, handleClose, index }: Props) => {

    return (
        <>
            {/* {index % 2 !== 0 && <span className="text-gray-400 text-lg hidden sm:block text-center">or</span>} */}
            <div className="relative flex justify-between items-center gap-2">
                <img src="/1544641784.svg" alt="close" className='h-4 w-4 max-w-[1rem] cursor-pointer flex-auto' onClick={(e) => handleClose(e, index)} />
                <input type="text" name="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(index, e.target.value);
                }} placeholder="Option" className="border flex-1 outline-none border-gray-500 rounded-sm py-2 px-3 bg-transparent text-white" required />
            </div>
        </>
    )
}

export default Input