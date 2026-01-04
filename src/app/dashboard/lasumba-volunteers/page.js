import VolunteersDashboard from '@/components/VolunteersDashboard'

export default function LasumbaVolunteers() {
  return (
    <div className="space-y-6 w-[90%] lg:w-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">LASUMBA Volunteers</h1>
        <p className="mt-2 text-gray-600">
          Manage and track all volunteer applications for LASUMBA Games 2026
        </p>
      </div>
      <VolunteersDashboard />
    </div>
  )
}
