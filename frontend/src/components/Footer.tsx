import { FaLinkedin, FaResearchgate, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { SiGooglescholar } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 text-gray-700 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mb-8">
          {/* Lab Info */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-green-600">
              Sustainable Food Systems Engineering Lab
            </h3>
            <p className="text-sm text-gray-600 mt-3">
              All copyrights reserved © SASE Lab {currentYear}
            </p>
          </div>
          
          {/* Contact */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-3 text-green-600">Contact</h3>
            <address className="text-gray-600 text-sm not-italic space-y-3 flex-grow">
              <div className="flex gap-3 items-start">
                <FaMapMarkerAlt className="text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p>2111 Lakeshore Road</p>
                  <p>Sainte-Anne-de-Bellevue, Quebec, Canada</p>
                  <p>H9X 3V9</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-center">
                <FaPhone className="text-green-600 flex-shrink-0" />
                <p>+1.514.398.7776</p>
              </div>
              
              <div className="flex gap-3 items-center">
                <FaEnvelope className="text-green-600 flex-shrink-0" />
                <a 
                  href="mailto:ebenezer.kwofie@mcgill.ca" 
                  className="text-green-600 hover:text-green-800 transition"
                >
                  ebenezer.kwofie@mcgill.ca
                </a>
              </div>
            </address>
          </div>
          
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-green-600">About SASE Lab</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              A group of young scientist focused on leveraging model-based approach, computation and digital innovation to drive a sustainable food system
            </p>
            
            <div className="flex gap-3 mt-auto">
              <a href="https://scholar.google.com/citations?user=QyKOR3oAAAAJ&hl=en&oi=ao" target="_blank" rel="noopener noreferrer" aria-label="Google Scholar"
                 className="bg-blue-50 p-2 rounded-full text-blue-600 hover:bg-blue-100 transition">
                <SiGooglescholar size={20} />
              </a>
              <a href="https://www.researchgate.net/lab/Ebenezer-Miezah-Kwofie-Lab" target="_blank" rel="noopener noreferrer" aria-label="ResearchGate"
                 className="bg-green-50 p-2 rounded-full text-green-600 hover:bg-green-100 transition">
                <FaResearchgate size={20} />
              </a>
              <a href="https://www.linkedin.com/company/sasel-lab/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                 className="bg-blue-50 p-2 rounded-full text-blue-600 hover:bg-blue-100 transition">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-5 pb-3 text-center">
          <p className="text-xs text-gray-500">
            © {currentYear} Sustainable Agrifood Systems Engineering Lab at McGill University
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 