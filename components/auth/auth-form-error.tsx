type AuthFormErrorProps = {
  message?: string;
};

export function AuthFormError({ message }: AuthFormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-sm font-medium text-destructive" role="alert">
      {message}
    </p>
  );
}
