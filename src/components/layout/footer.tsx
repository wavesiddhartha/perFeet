'use client'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container-medium py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-black rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">G</span>
              </div>
              <span className="font-semibold text-gray-900">Gehraiyaan</span>
            </div>
            <p className="text-sm text-gray-600">
              AI-powered video fact-checking for a more informed world.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Product</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-gray-600 hover:text-gray-900">Features</a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">API</a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">Documentation</a>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Company</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">Blog</a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">Careers</a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Legal</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">Terms</a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">Security</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 Gehraiyaan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}