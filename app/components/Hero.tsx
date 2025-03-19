export default function Hero() {
    return (
      <section id="home" className="relative h-[95vh] flex items-center justify-center text-center ">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/office-bg.jpeg')",
                "backgroundAttachment": "fixed",
          }}
        ></div>

  
        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-white">
          <h1 className="text-5xl font-bold mb-4">The Future of Workforce Management</h1>
          <p className="text-lg mb-6">Efficiently track employee performance</p>
          <a
            href="/login"
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            View Services
          </a>
        </div>
      </section>
    );
  }
  