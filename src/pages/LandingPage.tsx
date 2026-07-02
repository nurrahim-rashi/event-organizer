import { useEvents } from "../event/hooks/useEvents";

export default function LandingPage() {
  const { events } = useEvents();

  return (
    <div>
      <h1>Events</h1>

      {events.map((event: any) => (
        <div key={event.id}>
          <h3>{event.name}</h3>
          <p>{event.location}</p>
        </div>
      ))}
    </div>
  );
}
