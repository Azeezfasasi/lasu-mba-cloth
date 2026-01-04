import React from 'react'
import VolunteerForm from '@/components/VolunteerForm'
import { 
  Users, 
  Trophy, 
  Zap, 
  Target, 
  GamepadIcon, 
  Dices, 
  Activity, 
  Gamepad2, 
  Wind
} from 'lucide-react'

export default function LasumbaGamesPage() {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-center text-white">
            <h1 className="text-2xl font-bold md:text-3xl">
              CALL FOR PARTICIPANTS – LASUMBA GAMES
            </h1>
            <p className="mt-3 text-sm md:text-base">
              Join us and be part of an exciting and memorable sporting experience
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-8">

            {/* Event Info */}
            <section className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-blue-600">
                  📋 About the Event
                </h3>
                <p className="leading-relaxed text-gray-700">
                  In preparation for the forthcoming LASUMBA Games, the Executive Committee cordially invites interested managers to volunteer and actively participate in making the event a resounding success.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-blue-600">
                  📅 Event Date
                </h3>
                <p className="font-medium text-gray-900">
                  Sunday, 01 February 2026
                </p>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-blue-600">
                  🏅 Activities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Football</h4>
                    </div>
                    <p className="text-sm text-gray-700">MBA 1 vs MBA 2</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-orange-500 p-2 rounded-lg">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Track & Field</h4>
                    </div>
                    <p className="text-sm text-gray-700">100m, 200m, Sack Race</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-purple-500 p-2 rounded-lg">
                        <Dices className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Chess & Draught</h4>
                    </div>
                    <p className="text-sm text-gray-700">Mind Games</p>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-red-500 p-2 rounded-lg">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Table Tennis</h4>
                    </div>
                    <p className="text-sm text-gray-700">Competitive Play</p>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-yellow-500 p-2 rounded-lg">
                        <Gamepad2 className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Table Soccer</h4>
                    </div>
                    <p className="text-sm text-gray-700">Foosball</p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-cyan-500 p-2 rounded-lg">
                        <Wind className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Lawn Tennis</h4>
                    </div>
                    <p className="text-sm text-gray-700">Outdoor Sports</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-blue-50 p-4 border-l-4 border-blue-600">
                <p className="text-sm font-semibold text-blue-900 mb-2">
                  📞 Contact Information
                </p>
                <p className="font-semibold text-blue-900">
                  Princess Laura
                </p>
                <p className="text-sm text-blue-800">
                  Social Director
                </p>
                <p className="mt-2 font-medium text-blue-900">
                  📱 +234 813 558 7937
                </p>
              </div>
            </section>

            {/* Volunteer Registration Form */}
            <section className="mt-10">
              <h2 className="mb-6 text-xl font-semibold text-blue-600">
                Volunteer / Participant Registration
              </h2>
              <VolunteerForm />
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}

