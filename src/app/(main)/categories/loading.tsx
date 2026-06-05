//This should render loading skeleton using skeleton components, fallback will parent loading file

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <h2 className="text-xl font-semibold text-gray-700">
        Loading CATEGORIES...
      </h2>
    </div>
  );
}
