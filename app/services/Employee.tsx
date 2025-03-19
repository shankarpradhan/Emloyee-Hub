import Link from "next/link";

const employeeData = [
  {
    id: "employee-records",
    title: "Employee record management",
    description: "Effortlessly manage employee records with our intuitive system.",
    image: "/images/records.jpeg",
  },
  {
    id: "attendance-tracking",
    title: "Attendance tracking",
    description: "Track employee attendance effortlessly with our innovative tool.",
    image: "/images/attendance.jpeg",
  },
  {
    id: "payroll-management",
    title: "Payroll management",
    description: "Simplify payroll processing with our comprehensive solution.",
    image: "/images/payroll.jpeg",
  },
];

export default function EmployeeManagement() {
  return (
    <section id="services" className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Header */}
        <h3 className="text-green-600 font-bold uppercase tracking-wide">
          Streamlined Management
        </h3>
        <h2 className="text-4xl font-bold text-gray-900 mt-2">
          Boost Team Productivity with Real-Time Insights
        </h2>
      </div>

      {/* Cards Container */}
      <div className="mt-10 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {employeeData.map((item) => (
          <div key={item.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img src={item.image} alt={item.title} className="w-full h-56 object-cover" />
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">
              <Link href={`/services/details/${item.id}`} className="hover:underline">
                  {item.title} &gt;
                </Link>
              </h3>
              <p className="text-gray-600 mt-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
