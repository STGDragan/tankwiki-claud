export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 border-t border-gray-800 text-center text-sm">
      <div className="max-w-7xl mx-auto px-4">
        © {new Date().getFullYear()} TankWiki. All rights reserved.
      </div>
    </footer>
  )
}
