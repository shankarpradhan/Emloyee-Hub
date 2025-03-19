import Image from "next/image";

export default function HeroSection() {
    return (
      <section id="about" className="bg-white py-20 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* ✅ Left Side - Text Content */}
          <div>
            <p className="text-green-600 font-bold uppercase tracking-wide">Simplifying Employee Management</p>
            <h1 className="text-4xl font-bold text-gray-900 mt-2">Streamline your workforce effortlessly</h1>
            <p className="text-gray-600 mt-4 text-xl">
            Managing employees has never been simpler! EmployeeHub is an advanced employee management solution 
            that helps you streamline operations, automate attendance tracking, handle payroll seamlessly, 
            and monitor performance efficiently. Built on the robust foundation of MongoDB, our platform 
            ensures secure, scalable, and reliable data management—so you can focus on what matters most: 
            growing and empowering your business.
            </p>
            <a href="#contact" className="mt-6 inline-block text-green-600 font-semibold hover:underline">
              Get in touch
            </a>
          </div>
  
          {/* ✅ Right Side - Image */}
          <div>
            <Image
              src="/images/hero-section.jpeg"
              alt="Dashboard Preview"
              width={800} // Adjust as needed
              height={500}
              className="w-full rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>
    );
  }
  