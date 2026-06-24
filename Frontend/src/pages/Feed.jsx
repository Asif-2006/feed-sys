import React, { useState, useEffect } from 'react'
import axios from "axios"


const Feed = () => {

    const [posts, setPosts] = useState([
        {
            _id: "1",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            caption: "Beautiful scenery",
        }
    ])

    useEffect(() => {

        axios.get(`${import.meta.env.VITE_API_URL}/posts`)
            .then((res) => {

                setPosts(res.data.posts)

            })

    }, [])


    return (

        <section className="min-h-screen bg-[#0a0a0a] py-8">
            <div className="w-full max-w-[320px] md:max-w-[450px]  mx-auto space-y-6 px-2 md:px-4">

                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div
                            key={post._id}
                            className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl overflow-hidden shadow-xl hover:border-zinc-700 hover:scale-[1.01] transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.caption}
                                    className=" w-full max-h-[600px] object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <p className="text-zinc-200 text-sm leading-relaxed">
                                    {post.caption}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20">
                        <h1 className="text-zinc-500 text-xl">
                            No posts available
                        </h1>
                    </div>
                )}

            </div>
        </section>

    )
}

export default Feed