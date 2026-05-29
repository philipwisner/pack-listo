function Card({
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return <div data-slot="card" data-size={size} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" {...props} />;
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
