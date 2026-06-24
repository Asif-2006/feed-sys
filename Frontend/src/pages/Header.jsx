import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/feed"
          className="text-xl font-bold text-white tracking-wide"
        >
          SocialHub
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-full border border-zinc-800">

          <Link
            to="/feed"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              location.pathname === "/feed" || location.pathname === "/"
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Posts
          </Link>

          <Link
            to="/create-post"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              location.pathname === "/create-post"
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Create Post
          </Link>

        </div>
      </div>
    </header>
  );
}

export default Header;