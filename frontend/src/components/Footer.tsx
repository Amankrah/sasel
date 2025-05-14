const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About SASEL Lab</h3>
            <p className="text-gray-300 text-sm">
              The Sustainable Agrifood Systems Engineering Laboratory at McGill University 
              focuses on food system eco-efficiency and sustainable healthy diets.
            </p>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="text-gray-300 text-sm not-italic">
              <p>McGill University</p>
              <p>Macdonald Campus</p>
              <p>Email: sasel.lab@mcgill.ca</p>
            </address>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li><a href="/members" className="hover:text-blue-300">Team</a></li>
              <li><a href="/projects" className="hover:text-blue-300">Projects</a></li>
              <li><a href="/publications" className="hover:text-blue-300">Publications</a></li>
              <li><a href="/join" className="hover:text-blue-300">Join Us</a></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© {currentYear} Sustainable Agrifood Systems Engineering Laboratory. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 