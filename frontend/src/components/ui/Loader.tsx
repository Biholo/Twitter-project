
const Loader = () => {
  return (
    <div className="fixed top-4 right-8 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 z-50 flex items-center space-x-2">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
    <span className="text-sm text-gray-600 dark:text-gray-300">Chargement...</span>
  </div>
  )
}

export default Loader;