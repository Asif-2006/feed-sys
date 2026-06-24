import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import axios from "axios";
import { useNavigate } from "react-router-dom";


const CreatePost = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log("Form submitted");
    const formData = new FormData(e.target)
    axios.post(
      `${import.meta.env.VITE_API_URL}/create-post`,
      formData
    )
      .then((res) => {
        console.log(res);
        navigate("/feed");
      });
  }



  return (
    <section className="min-h-screen bg-zinc-950 text-white flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-[450px] bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl flex flex-col gap-5">

        <h1 className="text-3xl font-bold text-center">
          Create Post
        </h1>

        <input
          className="
      file:bg-indigo-600
      file:text-white
      file:border-0
      file:px-4
      file:py-2
      file:rounded-lg
      file:cursor-pointer
      w-full
      text-zinc-300
      border
      border-zinc-700
      rounded-lg
      p-2
      "
          type="file"
          name="image"
          accept="image/*"
        />

        <textarea
          className="
      w-full
      h-32
      bg-zinc-800
      border
      border-zinc-700
      rounded-lg
      p-3
      outline-none
      focus:border-indigo-500
      resize-none
      "
          name="caption"
          placeholder="What's on your mind?"
          required
        />

        <button
          className="
      active:scale-x-95
      bg-indigo-600
      hover:bg-indigo-700
      transition
      duration-200
      rounded-lg
      py-3
      font-semibold
      cursor-pointer
      "
          type="submit"
        >
          Share Post
        </button>

      </form>
    </section>
  )
}



export default CreatePost