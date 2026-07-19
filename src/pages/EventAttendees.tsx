import { useParams } from "react-router";
import useEventAttendees from "../hooks/event/useGetAttendees";
import type { Attendee } from "../types/attendeeType";
import Navbar from "../components/General/Navbar";

function EventAttendees() {
  const { id } = useParams();

  const { data, isLoading, error } = useEventAttendees(Number(id));

  const attendees = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading attendees...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          {error instanceof Error ? error.message : "Failed to load attendees."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0918] pt-24 px-8 pb-8">
      <Navbar />
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 border-b border-[#6D28D9]/30 pb-5">
          <h1 className="text-4xl font-bold text-[#C084FC]">Event Attendees</h1>

          <p className="mt-2 text-gray-400">
            Total Attendees:{" "}
            <span className="font-semibold text-white">{attendees.length}</span>
          </p>
        </div>

        {/* Empty State */}
        {attendees.length === 0 ? (
          <div className="rounded-2xl border border-[#6D28D9]/30 bg-[#1A1328] p-10 text-center">
            <h2 className="text-xl font-semibold text-white">
              No attendees yet
            </h2>

            <p className="mt-2 text-gray-400">
              Once someone purchases a ticket, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {attendees.map((attendee: Attendee) => (
              <div
                key={attendee.id}
                className="rounded-2xl border border-[#6D28D9]/30 bg-[#1A1328] p-6 transition hover:border-[#A855F7] hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {attendee.user.name}
                    </h2>

                    <p className="mt-1 text-gray-400">{attendee.user.email}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-[#A855F7]">
                      Registered
                    </p>

                    <p className="mt-1 text-sm text-gray-300">
                      {new Date(attendee.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventAttendees;
