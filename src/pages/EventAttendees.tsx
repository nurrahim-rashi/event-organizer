import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getEventAttendees } from "../api/attendees";
import { type Attendee } from "../types/attendeeType";

function EventAttendees () {
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
    async function fetchAttendees() {

        try {
            const result = await getEventAttendees(Number(id));
            console.log(result);

            setAttendees(result.data);
        } catch (error) {
            console.error(error);
            setError("Failed to load attendees");
        } finally {
            setLoading(false);
        }
    }

    if (id) {
        fetchAttendees();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="p-6">
                <p>Loading attendees...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500">{error}</p>
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                Event Attendees
            </h1>

            {attendees.length === 0 ? (
                <p>No attendees yet</p>
            ) : (
                attendees.map((attendee) =>(
                    <div
                    key={attendee.id}
                    className="border rounded-lg p-4 mb-3">
                        <p>{attendee.user.name}</p>
                        <p>{attendee.user.email}</p>
                    </div>
                ))
            )}
        </div>
    )
};

export default EventAttendees;