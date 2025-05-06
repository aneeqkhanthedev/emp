
export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-4 mt-8 border-t">
      <div className="container mx-auto text-center text-sm">
        © {new Date().getFullYear()} Atria Employee Verification. All rights reserved.
      </div>
    </footer>
  );
}
