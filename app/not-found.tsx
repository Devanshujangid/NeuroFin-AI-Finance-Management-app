export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        Page not found. The link you followed may be broken.
      </p>

      <a
        href="/"
        className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
      >
        Go Back Home
      </a>
    </div>
  );
}