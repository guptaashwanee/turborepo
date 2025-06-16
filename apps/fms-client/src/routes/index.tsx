import { Button } from '@anscer/ui/components/button';
import { Calendar } from '@anscer/ui/components/calendar';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div>Hello "/"!</div>
      <Calendar/>
      <Button>Button</Button>
    </>
  );
}
